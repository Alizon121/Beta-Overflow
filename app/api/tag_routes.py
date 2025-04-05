from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone
from app.models import db
from app.models.tag import Tag, question_tags
from app.forms.tag_form import TagForm

tag_routes = Blueprint('tags', __name__)

@tag_routes.route("/", methods=["GET"])
def view_tags():
    '''
        Gets all existing tags
    '''

    # Add Validations 
    existing_tags = Tag.query.all()

    if not existing_tags:
        return jsonify({"Error": "There are no tags here!"})

    return {
        "allTags": [existing_tag.to_dict() for existing_tag in existing_tags]
    }
        
    
@tag_routes.route("/", methods=["POST"])
@login_required
def create_tag():
    '''
        Allows a logged-in user to create a tag
    '''

    form = TagForm()

    # Manually obtain the csrf-token from cookies
    form["csrf_token"].data = request.cookies["csrf_token"]

    if not current_user.is_authenticated:
        return jsonify({"Error": "User is not authorized"}), 401
    
    print("PEPEPEPE", form.data)

    