from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app.models import db
from app.models.question import Question
from ..forms.question_form import QuestionForm

question_routes = Blueprint('questions', __name__)

@question_routes.route('/', methods=["GET"])
def all_questions():
    '''
        Query for all questions when a user is NOT logged-in or logged-in
    '''
    page = request.args.get('page', 1, type=int)
    per_page = 5
    questions = Question.query.order_by(Question.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    return {'questions': [question.to_dict() for question in questions.items]}


@question_routes.route("/", methods=["GET", "POST"])
@login_required
def add_question():
    '''
        Get the QuestionForm
        Create a a question by filling out the fields in the QuestionForm
    '''

    form = QuestionForm()

     # Manually obtain the csrf-token from cookies
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_question = Question(
            question_text = form.data["question_text"],
            user_id = current_user.id,
            created_at=datetime.now(timezone.utc)
        )

        db.session.add(new_question)
        db.session.commit()

        return jsonify({"question": new_question.to_dict()}), 201
    
    return jsonify({"Error": "Unable to post question"})

@question_routes.route("/<int:id>", methods={"DELETE"})
@login_required
def delete_question(id):
    '''
        Query for a question and delete if the use is authorized
    '''

    # Query for the question
    question = Question.query.get(id)

    # Return error if question not found
    if not question:
        return jsonify({"Error": "Question not found"}), 404

    # Provide authorization
    if current_user.id == question.user_id:
        db.session.delete(question)
        db.session.commit()

        return jsonify({"Message": "Question successfully deleted"}), 201
    else:
        return jsonify({"Error": "User is not authorized"}), 403
    

@question_routes.route("/update/<int:id>", methods=["PUT"])
@login_required
def update_question(id):
    '''
        Query for a question, check for authorized user, and update question if authorized
    '''

    # Query for the question
    question = Question.query.get(id)

    if not question:
        return jsonify({"Error": "Question was not found"}), 404
    
    # Authorize the user:
    if current_user.id == question.user_id:
        
        # Get data from the json request
        data = request.get_json()

        if "question_text" in data:
            question_text=data["question_text"].strip()

            if not question_text:
                return jsonify({"Error": "Question must be a minimum of 25 characters"})

            # Set the updated question on the original question
            question.question_text=data["question_text"]

        # Commit change to db
        db.session.commit()

        # return jsonify reponse:
        return jsonify({"question": question.to_dict()})
    
    # return jsonify error message if user is not authorized
    return jsonify({"Error": "User is not authorized"}), 403
