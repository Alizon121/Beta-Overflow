from flask import Blueprint, jsonify, request
from app.models import db, Question, ChatConversation, ChatMessage
from sqlalchemy.orm import joinedload
from app.services.ai_client import get_groq_client
import json

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
      "rating": 4.5
    }
  ]
}

Rules:
- Suggest only real, well-documented routes when possible
- Match the requested grade accurately (YDS for sport/trad, V-scale for bouldering)
- If most_climbed is true, prioritize classic and iconic routes at that location
- If rating_preference is "highly_rated", only include routes with 4+ star reputations
- If rating_preference is "top_rated", only include routes with 4.5+ star reputations
- Return an empty routes array if no routes match, and add a "message" field explaining why
- Never fabricate routes; if the area is unknown, say so in a message field
"""


@ai_routes.route("/suggest-routes", methods=["POST"])
def suggest_routes():
    '''
    Suggest up to 5 climbing routes based on user criteria
    '''
    client = get_groq_client()

    data = request.json or {}
    crag_location = data.get("crag_location", "").strip()
    country = data.get("country", "").strip()
    if data.get("state", "") != None:
         state= data.get("state", "").strip() == True
    else:
          state = None
    if data.get("region", "") != None:
         region= data.get("region", "").strip() == True
    else:
          region = None
    grade = data.get("grade", "").strip()
    style = data.get("style", "").strip()
    rating_preference = data.get("rating_preference", "any")
    most_climbed = data.get("most_climbed", False)

    if not crag_location or not grade or not style:
        return jsonify({"error": "crag_location, grade, and style are required"}), 400

    user_query = (
        f"Suggest climbing routes at: {crag_location}. "
        f"In {country}" + (f", {state}" if state else "") + (f", {region}" if region else "") + ". "
        f"Grade: {grade}. Style: {style}. "
        f"Rating preference: {rating_preference}. "
        f"Prioritize most-climbed/classic routes: {'yes' if most_climbed else 'no'}."
    )

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": ROUTE_ADVISOR_SYSTEM_PROMPT},
            {"role": "user", "content": user_query}
        ],
        temperature=0.3
    )

    raw = response.choices[0].message.content.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end > start:
            try:
                result = json.loads(raw[start:end])
            except json.JSONDecodeError:
                result = {"routes": [], "message": "Could not parse route suggestions."}
        else:
            result = {"routes": [], "message": "Could not parse route suggestions."}

    return jsonify(result)