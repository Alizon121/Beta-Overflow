from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app.models import db
from app.models.tag import Tag, question_tags

tag_routes = Blueprint('tags', __name__)

@tag_routes.route("/", methods=["GET"])
def view_tags():
    '''
        Adds a tag to a question
    '''

    # Add Validations 

    # validation for providing NO id
    # if not id:
    #     return jsonify({"Error": "Valid question ID required"}), 400
    
    # Validation for an id that does not exist
    existing_tags = Tag.query.all()

    print("POPOPO", existing_tags)
    