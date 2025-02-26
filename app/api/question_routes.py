from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app.models import db
from app.models.question import Question
from app.models.comments import Comment
from app.models.user import User
from ..forms.question_form import QuestionForm
from ..forms.comment_form import CommentForm

question_routes = Blueprint('questions', __name__)

@question_routes.route('/<int:page>', methods=["GET"])
def all_questions(page):
    '''
        Query for all questions when a user is NOT logged-in or logged-in
    '''

    per_page = 5
    questions = Question.query.order_by(Question.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    all_questions = Question.query.all()
    # If there are no questions, then send a response
    # Use this response in the thunk action to indicate "disable"
    if len([question for question in questions]) < 1:
        return jsonify({"Message": "There are currently no questions. Post a question now!"}), 404
    
    return {
        'questions': [question.to_dict() for question in questions.items],
        'allQuestions': len(all_questions)
        }

@question_routes.route("/users/<int:page>")
@login_required
def get_user_questions( page):
    PER_PAGE=3
    user_questions = Question.query.filter_by(user_id=current_user.id).order_by(Question.created_at.desc()).paginate(page=page, per_page=PER_PAGE, error_out=False)
    user_all_questions = User.query.get(current_user.id).question

    # Check if user does not have questions
    if len(user_questions.items) < 1:
        return jsonify({"Message": "User currently does not have any questions.",
                        "questions": [question.to_dict() for question in user_questions.items]
                        })
    
    return jsonify({
        "questions": [question.to_dict() for question in user_questions.items],
        "allUserQuestions": len(user_all_questions)
    })

@question_routes.route('/title', methods=["GET"])
@login_required
def all_question_titles():
    '''
        Query for all question titles needed for comments
    '''

    questions= Question.query.all()
    return jsonify({
        'questionTitles': [{'id': q.id, 'title': q.title} for q in questions]
    })


@question_routes.route("/", methods=["GET","POST"])
@login_required
def add_question():
    '''
        Get the QuestionForm
        Create a a question by filling out the fields in the QuestionForm
    '''

    form = QuestionForm()

     # Manually obtain the csrf-token from cookies
    form['csrf_token'].data = request.cookies['csrf_token']

    # Validation for min char length
    # WHY DOESN'T THE VALIDATION FROM THE FORM WORK?

    if len(form.data["title"]) < 5:
        return jsonify({"Error": "Title must be at least 5 characters long"})

    if len(form.data["question_text"]) < 25:
        return jsonify({"Error": "Question must be a minimum of 25 characters"})

    if form.validate_on_submit():
        new_question = Question(
            title = form.data["title"],
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
    

@question_routes.route("/<int:id>", methods=["PUT"])
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

        if "title" in data:
            title=data["title"].strip()

            if not title:
                return jsonify({"Error": "Please provide a title"})

        if "question_text" in data:
            question_text=data["question_text"].strip()

            if not question_text:
                return jsonify({"Error": "Please provide a question"})

            # Set the updated question on the original question
            question.title=data["title"]
            question.question_text=data["question_text"]

        # Commit change to db
        db.session.commit()

        # return jsonify reponse:
        return jsonify({"Question": question.to_dict()})
    
    # return jsonify error message if user is not authorized
    return jsonify({"Error": "User is not authorized"}), 403


##############################Comments#########################
# We need a route that gets all comments for a question
@question_routes.route("/<int:id>/comments", methods=["GET", "POST"])
def handle_comments(id):
    if request.method == "GET":
        '''
            When a question is selected, the question should be able to display the question and its comments if there are any.
        '''
        # Locate the question
        question = Question.query.get(id)

        # Check if question exists
        if not question:
            return jsonify({"Error": "Unable to locate the question"}), 404
        
        # Locate comments
        comments = Question.query.get(id).comment

        # Query for all the users
        users = User.query.all()
        
        # Check if there are any comments
        if not comments:
            return jsonify({
                "question": question.to_dict(),
                "comments": "No comments found"
            })
        
        return jsonify({
            "userQuestion": question.to_dict(),
            "comments": [comment.to_dict() for comment in comments],
            "users": [user.to_dict() for user in users]
        })
    
    elif request.method == "POST":
        '''
            Create a comment for a question
        '''
        
        question = Question.query.get(id)
        # comments = Question.query.get(id).comment

        if not question:
            return jsonify({"Error": "Question not found"}), 404

        form = CommentForm()
        
        # Manually obtain the csrf-token from cookies
        form['csrf_token'].data = request.cookies['csrf_token']

        if not current_user.is_authenticated:
            return jsonify({"Error": "User is not authorized"}), 401
        
        if len(form.data["comment_text"]) < 15:
            return jsonify({"Error": "Comment must be a minimum of 15 characters"}), 400

        if form.validate_on_submit():
            new_comment= Comment(
                comment_text = form.data["comment_text"],
                user_id = current_user.id,
                question_id=id,
                created_at=datetime.now(timezone.utc)
            )

            db.session.add(new_comment)
            db.session.commit()

            return jsonify({"comment": new_comment.to_dict()}), 201
        
        return jsonify({"Error": "Unable to create comment"})


