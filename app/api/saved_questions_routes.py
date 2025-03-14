from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app.models import db
from app.models.question import Question
from app.models import User

saved_question_routes = Blueprint('saved_questions', __name__)

# @saved_question_routes.route('/<int:page>', methods=["GET"])
# def user_saved_questions():
#     '''
#         Query for all a users saved questions
#     '''

#     PER_PAGE=5

#     # saved_questions = 