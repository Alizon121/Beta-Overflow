from flask import Blueprint, jsonify, request
from app.models import Question
from sqlalchemy.orm import joinedload
from app.services.ai_client import get_groq_client
import os

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
        # context += f"Title: {q.title}",
        # context+=f"Question: {q.question_text}"
        # context+=f"Answers: "
        context+=f"""
                f"Title: {q.title}",
                f"Question: {q.question_text}"
                f"Answers: "
                """
        if q.comments:
            for comment in q.comments:
                    context += f"-{comment.comment_text} -\n"
        else:
            context += f"No answers yet.\n"
    return context.strip()

@ai_routes.route("/chat", methods=["POST"])
def chat():
    '''
        Ask openai LLM a message
    '''

    client = get_groq_client()

    user_message = request.json.get("message")
    questions = get_questions(limit=5)

    forum_context = build_context(questions)

    response = client.chat.completions.create(
         model="llama-3.3-70b-versatile",
         messages=[
              {
               "role": "system", 
               "content": SYSTEM_PROMPT
               },
              {
                "role": "system", 
                "content": f"Forum posts:\n{forum_context}"
              },
              {
                "role": "user", 
                "content": user_message
              }
         ],
         temperature=0.4
    )

    reply = response.choices[0].message.content

    return jsonify({
        "reply": response.choices[0].message.content
    })