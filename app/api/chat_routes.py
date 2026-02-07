from flask import Blueprint, jsonify, request
from app.models import Question
from sqlalchemy.orm import joinedload
from openai import OpenAI
import os

chat_routes = Blueprint('chat', __name__)

# Query for questions with comments
def get_questions(limit=5):
     return (Question.query.options(joinedload(Question.comment)).order_by(Question.created_at.desc()).limit(limit).all())

SYSTEM_PROMPT = """
    You are an AI assistant for a rock climbing Q&A forum.

    Rules:
    - Answer ONLY using the provided forum posts
    - If the posts do not contain enough information, say so
    - Do NOT give medical diagnoses or treatment plans
    - Be friendly, concise, and climber-aware
    - Cite post titles when relevant
"""

def get_open_API_key():
     if not os.getenv("OPEN_API_KEY"):
          raise RuntimeError("OPEN_AP_KEY not set")
     else:
          return OpenAI()

def build_context(questions):
    context = ""
    for q in questions:
        context += f"""
            Title: {q.title},
            Question: {q.question_text}
            Answers: """
        if q.comments:
            for comment in q.comments:
                    context += f"{comment.comment_text} -\n"
        else:
            context += f"No answers yet.\n"
            """
        """
    return context.strip()

@chat_routes.route("/", methods=["POST"])
def chat():
    '''
        Ask openai LLM a message
    '''

    client = get_open_API_key()

    user_message = request.json["message"]
    questions = get_questions(limit=5)

    forum_context = build_context(questions)

    response = client.chat.completions.create(
         model="gpt-4o-mini",
         messages=[
              {"role": "system", "content": SYSTEM_PROMPT},
              {"role": "system", "content": f"Forum posts:\n{forum_context}"},
              {"role": "system", "content": user_message}
         ],
         temperature=0.4
    )

    return jsonify({
        "reply": response.choices[0].message.content
    })