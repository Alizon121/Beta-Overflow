from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app.models import db
from app.models.question import Question
from app.models.user import User
from app.models.saved_question import SavedQuestion
from app.models import User

saved_question_routes = Blueprint('saved_questions', __name__)

@saved_question_routes.route('/<int:page>', methods=["GET"])
def user_saved_questions(page):
    '''
        Query for all a users saved questions
    '''

    PER_PAGE=5

    # We need to query for all saved questions of the current user
    saved_questions = SavedQuestion.query.order_by(SavedQuestion.created_at.desc()).filter_by(user_id=current_user.id).paginate(page=page, per_page=PER_PAGE, error_out=False)
    
    # Check if user has saved_questions
    if len(saved_questions.items) < 1:
        return jsonify({
            "Message": "No saved questions located.",
            "savedQuestions": []
        }), 404

    return jsonify({
        "savedQuestions": [question.to_dict() for question in saved_questions.items]
    })

@saved_question_routes.route("/add", methods=["POST"])
@login_required
def add_saved_question():
    '''
        Add a saved question to list of saved questions
    '''

    data = request.get_json()
    question_id = data.get("question_id")

    if not question_id:
        return jsonify({"Error": "Question ID required"}), 400
    
    existing_question = SavedQuestion.query.filter_by(
        user_id = current_user.id,
        question_id = question_id
    ).first()

    if existing_question:
        return jsonify({"Error": "Question already exists"}), 400
    
    saved_question = SavedQuestion(
        user_id = current_user.id,
        question_id = question_id
    )


    try:

        db.session.add(saved_question)
        db.session.commit()
        return jsonify({"Message": "Question successfully saved"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@saved_question_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_saved_question(id):
    '''
        Query for a saved question and delete if the user is authorized
    '''

    # Query for the saved question
    saved_question = SavedQuestion.query.filter_by(
        user_id=current_user.id,
        question_id=id).first()

    # Validation
    if not saved_question:
        return jsonify({"Error": "Saved question not found."}), 404

    # # Authorization
    if current_user.id == saved_question.user_id:
        db.session.delete(saved_question)
        db.session.commit()

    return jsonify({"Message": "Saved question successfully removed."}), 200
