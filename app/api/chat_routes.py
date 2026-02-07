from flask import Blueprint, jsonify, request
from openai import OpenAI

chat_routes = Blueprint('chat', __name__)
client = OpenAI()

SYSTEM_PROMPT = """
    You are an AI assistant for a rock climbing Q&A forum.

    Rules:
    - Answer ONLY using the provided forum posts
    - If the posts do not contain enough information, say so
    - Do NOT give medical diagnoses or treatment plans
    - Be friendly, concise, and climber-aware
    - Cite post titles when relevant
"""

def build_context(posts):
    context = ""
    for post in posts:
        context += f"""
            Title: {post["title"]},
            Question: {posts["question_text"]}
            Answers: """
        for a in post["comment_text"]:
                context += f"{a} -\n"
        """
        """
    return context

@chat_routes.route("/chat", methods=["POST"])
def chat():
    '''
        Ask openai LLM a message
    '''

    user_message = request.json["message"]

    forum_context = build_context(FORUM_POSTS)

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