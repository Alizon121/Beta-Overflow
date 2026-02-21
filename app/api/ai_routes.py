from flask import Blueprint, jsonify, request
from app.models import db, Question, ChatConversation, ChatMessage
from sqlalchemy.orm import joinedload
from app.services.ai_client import get_groq_client

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