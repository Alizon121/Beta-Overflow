from flask import Blueprint, jsonify, request
from app.models import db, Question, ChatConversation, ChatMessage
from sqlalchemy.orm import joinedload
from app.services.ai_client import get_groq_client
import json
import urllib.request
import urllib.error

ai_routes = Blueprint('chat', __name__)

# Query for questions with comments
def get_questions(limit=5):
     return (Question.query
             .options(joinedload(Question.comments))
             .order_by(Question.created_at.desc())
             .limit(limit)
             .all()
        )

SYSTEM_PROMPT = """
    You are an AI assistant for a rock climbing Q&A forum.

    Rules:
    - Answer ONLY using the provided forum posts
    - If the posts do not contain enough information, say so
    - Do NOT give medical diagnoses or treatment plans
    - Be friendly, concise, and climber-aware
    - Cite post titles when relevant
"""

def build_context(questions):
    context = ""
    for q in questions:
        context += f"Title: {q.title}"
        context+=f"Question: {q.question_text}"
        context+=f"Answers: "
        # context+=f"""
        #         f"Title: {q.title}",
        #         f"Question: {q.question_text}"
        #         f"Answers: "
        #         """
        if q.comments:
            for comment in q.comments:
                    context += f"-{comment.comment_text} -\n"
        else:
            context += f"No answers yet.\n"
    return context.strip()

@ai_routes.route("/chat", methods=["POST"])
def chat():
    '''
        Ask LLM a message
    '''

    client = get_groq_client()

    message = request.json.get("message")
    conversation_id = request.json.get("conversation_id")
    questions = get_questions(limit=5)

    if not conversation_id:
         conversation = ChatConversation()
         db.session.add(conversation)
         db.session.commit()
    else:
         conversation = ChatConversation.query.get(conversation_id)

    user_msg = ChatMessage(
         conversation_id=conversation.id,
         role="user",
         content=message
    )

    db.session.add(user_msg)

    history = ChatMessage.query.filter_by(
         conversation_id=conversation.id
    ).order_by(ChatMessage.created_at).all()

    forum_context = build_context(questions)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Forum posts:\n{forum_context}"},
    ]
    
    for msg in history:
         messages.append({
              "role": msg.role,
              "content": msg.content
         })
    

    response = client.chat.completions.create(
         model="llama-3.3-70b-versatile",
         messages=messages,
         temperature=0.4
    )
        #  messages=[
        #       {
        #        "role": "system", 
        #        "content": SYSTEM_PROMPT
        #        },
        #       {
        #         "role": "system", 
        #         "content": f"Forum posts:\n{forum_context}"
        #       },
        #       {
        #         "role": "user", 
        #         "content": user_msg
        #       }
        #  ],

    reply = response.choices[0].message.content
    assistant_msg = ChatMessage(
         conversation_id=conversation.id,
         role="assistant",
         content=reply
    )

    db.session.add(assistant_msg)
    db.session.commit()

    return jsonify({
        "reply": reply
    })


# ── OpenBeta GraphQL integration ────────────────────────────────────────────

OPENBETA_API = "https://api.openbeta.io"

# Returns the direct child areas of a location (one level deep).
# Used to populate the hierarchy dropdowns on the frontend.
AREAS_BY_LOCATION_QUERY = """
query AreasByLocation($location: String!) {
  areas(filter: { area_name: { match: $location } }) {
    area_name
    children {
      area_name
    }
  }
}
"""

# Used when a parent area is known: queries the parent and navigates to the
# target area's children, avoiding false matches from same-named areas elsewhere.
AREAS_BY_PARENT_QUERY = """
query AreasByParent($parent: String!) {
  areas(filter: { area_name: { match: $parent } }) {
    area_name
    children {
      area_name
      children {
        area_name
      }
    }
  }
}
"""

YDS_ORDER = [
    "5.4", "5.5", "5.6", "5.7", "5.8", "5.9",
    "5.10a", "5.10b", "5.10c", "5.10d",
    "5.11a", "5.11b", "5.11c", "5.11d",
    "5.12a", "5.12b", "5.12c", "5.12d",
    "5.13a", "5.13b", "5.13c", "5.13d",
    "5.14a", "5.14b", "5.14c", "5.14d",
    "5.15a", "5.15b", "5.15c", "5.15d",
]
VSCALE_ORDER = [f"V{i}" for i in range(18)]

STYLE_FIELD_MAP = {
    "sport": "sport",
    "trad": "trad",
    "bouldering": "bouldering",
    "top rope": "tr",
    "aid": "aid",
    "mixed": "mixed",
    "alpine": "alpine",
}

# Global name search — used as a fallback when no parent context is available.
OPENBETA_QUERY = """
query FindRoutes($areaName: String!) {
  areas(filter: { area_name: { match: $areaName } }) {
    area_name
    climbs {
      name
      grades { yds vscale }
      type { sport trad bouldering tr aid mixed alpine }
      content { description }
    }
    children {
      area_name
      climbs {
        name
        grades { yds vscale }
        type { sport trad bouldering tr aid mixed alpine }
        content { description }
      }
      children {
        area_name
        climbs {
          name
          grades { yds vscale }
          type { sport trad bouldering tr aid mixed alpine }
          content { description }
        }
      }
    }
  }
}
"""

# Scoped search: queries the known parent area and navigates down to the target
# area's climbs, preventing same-named areas in other regions from leaking in.
OPENBETA_QUERY_VIA_PARENT = """
query FindRoutesViaParent($parentName: String!) {
  areas(filter: { area_name: { match: $parentName } }) {
    area_name
    children {
      area_name
      climbs {
        name
        grades { yds vscale }
        type { sport trad bouldering tr aid mixed alpine }
        content { description }
      }
      children {
        area_name
        climbs {
          name
          grades { yds vscale }
          type { sport trad bouldering tr aid mixed alpine }
          content { description }
        }
        children {
          area_name
          climbs {
            name
            grades { yds vscale }
            type { sport trad bouldering tr aid mixed alpine }
            content { description }
          }
        }
      }
    }
  }
}
"""


def _openbeta_request(query, variables):
    payload = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    req = urllib.request.Request(
        OPENBETA_API,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; beta-overflow-app/1.0)",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenBeta HTTP {e.code}: {body}") from e

    if "errors" in result:
        messages = [err.get("message", str(err)) for err in result["errors"]]
        raise RuntimeError(f"OpenBeta GraphQL errors: {'; '.join(messages)}")

    print("DEBUGUGUG OpenBeta response:", result)
    return result


def _collect_climbs(areas):
    """Recursively collect all climbs from an area hierarchy."""
    climbs = []
    for area in areas:
        area_name = area.get("area_name", "")
        for climb in area.get("climbs") or []:
            climb["_area_name"] = area_name
            climbs.append(climb)
        climbs.extend(_collect_climbs(area.get("children") or []))
    return climbs


def _grade_neighbors(grade, is_boulder, spread=1):
    """Return grades within `spread` steps of the target grade."""
    order = VSCALE_ORDER if is_boulder else YDS_ORDER
    if grade not in order:
        return {grade}
    idx = order.index(grade)
    return set(order[max(0, idx - spread):idx + spread + 1])


def _search_openbeta(crag_location, grade, style, parent_location=None):
    """
    Query OpenBeta GraphQL for routes matching the criteria.

    When parent_location is provided, queries the parent area and navigates
    down to the exact crag — preventing same-named areas in other regions
    from leaking into results.

    Returns a list of up to 5 route dicts, or None if nothing was found.
    """
    if parent_location:
        try:
            data = _openbeta_request(OPENBETA_QUERY_VIA_PARENT, {"parentName": parent_location})
        except Exception as e:
            print(f"[OpenBeta /suggest-routes via parent] {e}")
            return None

        parent_areas = (data.get("data") or {}).get("areas") or []
        crag_lower = crag_location.lower()
        target_areas = []
        for p in parent_areas:
            for child in p.get("children") or []:
                if child.get("area_name", "").lower() == crag_lower:
                    target_areas.append(child)

        if not target_areas:
            return None
        all_climbs = _collect_climbs(target_areas)
    else:
        try:
            data = _openbeta_request(OPENBETA_QUERY, {"areaName": crag_location})
        except Exception as e:
            print(f"[OpenBeta /suggest-routes] {e}")
            return None

        areas = (data.get("data") or {}).get("areas") or []
        if not areas:
            return None
        all_climbs = _collect_climbs(areas)
    if not all_climbs:
        return None

    is_boulder = style.lower() == "bouldering"
    style_key = STYLE_FIELD_MAP.get(style.lower())
    grade_field = "vscale" if is_boulder else "yds"

    # Filter by style
    styled = [c for c in all_climbs if style_key and (c.get("type") or {}).get(style_key)]
    if not styled:
        styled = all_climbs  # no style data — use everything

    # Filter by grade: exact first, then ±1 step, then full style pool
    exact = [c for c in styled if (c.get("grades") or {}).get(grade_field) == grade]
    if exact:
        pool = exact
    else:
        neighbors = _grade_neighbors(grade, is_boulder, spread=1)
        pool = [c for c in styled if (c.get("grades") or {}).get(grade_field) in neighbors]
        if not pool:
            pool = styled

    routes = []
    for c in pool[:5]:
        grades = c.get("grades") or {}
        content = c.get("content") or {}
        routes.append({
            "name": c.get("name", "Unknown"),
            "grade": grades.get(grade_field) or grade,
            "style": style,
            "crag": c.get("_area_name") or crag_location,
            "description": content.get("description") or "No description available.",
            "rating": None,
        })

    return routes if routes else None


# ── LLM fallback prompt ──────────────────────────────────────────────────────

ROUTE_ADVISOR_SYSTEM_PROMPT = """
You are an expert rock climbing route advisor with deep knowledge of climbing areas worldwide.

When given criteria (crag/location, country, state/region, grade, style, rating preference, and popularity), suggest up to 5 real climbing routes that best match.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "routes": [
    {
      "name": "Route Name",
      "grade": "5.10a",
      "style": "Sport",
      "crag": "Crag or Area Name",
      "description": "Brief description of the route character, rock type, and what makes it notable.",
      "rating": null
    }
  ]
}

Rules:
- Suggest only real, well-documented routes when possible
- Match the requested grade accurately (YDS for sport/trad, V-scale for bouldering)
- If most_climbed is true, prioritize classic and iconic routes at that location
- If rating_preference is "highly_rated", only include routes with strong community reputations
- Return an empty routes array if no routes match, and add a "message" field explaining why
- Never fabricate routes; if the area is unknown, say so in a message field
"""


@ai_routes.route("/areas", methods=["GET"])
def get_areas():
    """Return child areas of a location from OpenBeta.

    When `parent` is supplied, queries the parent area and navigates down to
    `location`'s children — this prevents same-named areas in other regions
    from polluting the dropdown.
    """
    location = request.args.get("location", "").strip()
    parent = request.args.get("parent", "").strip()
    if not location:
        return jsonify({"error": "location query param is required"}), 400

    crags = []

    if parent:
        # Query the known parent, then find the matching child and return its children.
        try:
            data = _openbeta_request(AREAS_BY_PARENT_QUERY, {"parent": parent})
        except Exception as e:
            print(f"[OpenBeta /areas] {e}")
            return jsonify({"error": str(e)}), 502

        parent_areas = (data.get("data") or {}).get("areas") or []
        location_lower = location.lower()
        for p in parent_areas:
            for child in p.get("children") or []:
                if child.get("area_name", "").lower() == location_lower:
                    for grandchild in child.get("children") or []:
                        name = grandchild.get("area_name", "").strip()
                        if name:
                            crags.append({"name": name})
    else:
        # No parent context — fall back to a direct name search.
        try:
            data = _openbeta_request(AREAS_BY_LOCATION_QUERY, {"location": location})
        except Exception as e:
            print(f"[OpenBeta /areas] {e}")
            return jsonify({"error": str(e)}), 502

        top_level = (data.get("data") or {}).get("areas") or []
        for area in top_level:
            for child in area.get("children") or []:
                name = child.get("area_name", "").strip()
                if name:
                    crags.append({"name": name})

    crags.sort(key=lambda c: c["name"])
    return jsonify({"areas": crags})


@ai_routes.route("/suggest-routes", methods=["POST"])
def suggest_routes():
    """Suggest up to 5 climbing routes. Queries OpenBeta first, falls back to LLM."""
    data = request.json or {}
#     Helper function to safely extract and clean string fields
    def _str(key):
        return (data.get(key) or "").strip() or None

    country  = _str("country") or ""
    state    = _str("state")
    region   = _str("region")
    area     = _str("area")
    sub_area = _str("sub_area")
    zone     = _str("zone")
    crag        = _str("crag")
    crag_parent = _str("crag_parent")
    grade    = _str("grade") or ""
    style    = _str("style") or ""
    rating_preference = data.get("rating_preference", "any")
    most_climbed = data.get("most_climbed", False)

    # Use the most specific location provided (deepest level wins)
    search_location = crag or zone or sub_area or area

    if not search_location or not grade or not style:
        return jsonify({"error": "a location, grade, and style are required"}), 400

    # Primary: OpenBeta real route database
    routes = _search_openbeta(search_location, grade, style, parent_location=crag_parent)
    if routes:
        return jsonify({"routes": routes, "source": "OpenBeta"})

    # Fallback: LLM (covers areas not yet in OpenBeta)
    client = get_groq_client()
    location_parts = [p for p in [country, state, region, area, sub_area, zone, crag] if p]
    user_query = (
        f"Suggest climbing routes at: {', '.join(location_parts)}. "
        f"Grade: {grade}. Style: {style}. "
        f"Rating preference: {rating_preference}. "
        f"Prioritize most-climbed/classic routes: {'yes' if most_climbed else 'no'}."
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": ROUTE_ADVISOR_SYSTEM_PROMPT},
            {"role": "user", "content": user_query},
        ],
        temperature=0.3,
    )

    raw = response.choices[0].message.content.strip()
    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        start, end = raw.find("{"), raw.rfind("}") + 1
        if start != -1 and end > start:
            try:
                result = json.loads(raw[start:end])
            except json.JSONDecodeError:
                result = {"routes": [], "message": "Could not parse route suggestions."}
        else:
            result = {"routes": [], "message": "Could not parse route suggestions."}

    result["source"] = "AI"
    return jsonify(result)