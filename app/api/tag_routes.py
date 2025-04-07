from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
# from datetime import datetime, timezone
from app.models import db
from app.models.tag import Tag
from app.forms.tag_form import TagForm
from sqlalchemy.exc import IntegrityError


tag_routes = Blueprint('tags', __name__)

@tag_routes.route("/", methods=["GET"])
def view_tags():
    '''
        Gets all existing tags. Can be used to search for a tag(s), which can then be paired with adding a tag to a question.
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
        Allows a logged-in user to create a tag, which can then be later added to a question.
    '''

    form = TagForm()

    # Manually obtain the csrf-token from cookies
    form["csrf_token"].data = request.cookies["csrf_token"]

    # Validation for authorization
    if not current_user.is_authenticated:
        return jsonify({"Error": "User is not authorized"}), 401
    
    # Validation to check if the tag already exists:
    existing_tag = Tag.query.filter_by(tag_name=form.data["name"]).first()
    if existing_tag:
        return jsonify({"Error": "Tag already exists"}), 400
    
    # Validation for length
    if len(form.data["name"]) < 3:
        return jsonify({"Error": "Tag must be at least three characters long"})

    if form.validate_on_submit():
        try:
            new_tag = Tag(
                tag_name = form.data["name"],
                user_id = current_user.id
            )

            db.session.add(new_tag)
            db.session.commit()

            return jsonify({"tag": new_tag.to_dict()}), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({"Error": "Tag exists already"}), 400
    return jsonify({"Error": "Unable to create tag"})


@tag_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_tag(id):

    tag = Tag.query.get(id)

    # Validations
    if not tag:
        return jsonify({"Error": "Tag was not located"})

    # Validation for authorization
    if current_user.id != tag.user_id:
        return jsonify({"Error": "User is not authorized"})
    else:
        db.session.delete(tag)
        db.session.commit()
        return jsonify({"Message": "Tag succesfully deleted"})
    
