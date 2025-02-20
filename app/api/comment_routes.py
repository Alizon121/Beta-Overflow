from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models.comments import Comment
from app.models.user import User
# from app.forms.comment_form import CommentForm
# from datetime import datetime, timezone
from app.models import db

comment_routes = Blueprint('comments', __name__)

@comment_routes.route("/<int:page>", methods=["GET"])
@login_required
def get_user_comments(page):
    '''
        Query for all the comments for an authorized user
    '''

    # Query for all comments that have the current user's id
    # page = request.args.get('page', 1, type=int)
    PER_PAGE=1
    comments = Comment.query.join(User).filter(User.id==current_user.id).order_by(Comment.created_at.desc()).paginate(page=page, per_page=PER_PAGE, error_out=False)

    # If there are no comments, then send a response
    if len([comment for comment in comments]) < 1:
        return jsonify({"Message": "You currently have no comments."})

    return jsonify({"comments": [comment.to_dict() for comment in comments.items]})

# I MOVED THIS ROUTE TO QUESTION_ROUTES TO MAKE RESTFUL
# @comment_routes.route("/<int:id>", methods=["GET", "POST"])
# @login_required
# def make_comment(id):
#     '''
#         Create a comment for a question
#     '''

#     form = CommentForm()

#     # Manually obtain the csrf-token from cookies
#     form['csrf_token'].data = request.cookies['csrf_token']

#     if form.validate_on_submit():
#         new_comment= Comment(
#             comment_text = form.data["comment_text"],
#             user_id = current_user.id,
#             question_id=id,
#             created_at=datetime.now(timezone.utc)
#         )

#         db.session.add(new_comment)
#         db.session.commit()

#         return jsonify({"comment": new_comment.to_dict()}), 201
    
#     return jsonify({"Error": "Unable to create comment"})


@comment_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_comment(id):
    '''
        Allows a logged-in and authorized user to delete a comment
    '''

    # Query for the comment
    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"Error": "Comment not found"}), 404

    # Authorize the user
    if current_user.id == comment.user_id:
        db.session.delete(comment)
        db.session.commit()

        return jsonify({"Message": "Comment successfully deleted"})
    
    return jsonify({"Error": "User is unauthorized"}), 403


@comment_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_comment(id):
    '''
        Allows a logged-in and authorized user to update a comment
    '''

    # Query for comment
    comment = Comment.query.get(id)

    if not comment:
        return jsonify({"Error": "Comment not found"}), 404
    
    # Authorize the user
    if current_user.id == comment.user_id:
        # Get data from the json request:
        data = request.get_json()


        if "comment_text" in data:
            comment_text = data["comment_text"].strip()

            if not comment_text:
                return jsonify({"Error": "Please provide a comment"})
            
            if len(comment_text) < 15:
                return jsonify({"Error": "Comment must be a minimum of 15 characters."})
            
            # Set the updated comment on original comment
            comment.comment_text = data["comment_text"]

        # Commit the change
        db.session.commit()

        return jsonify({"Comment": comment.to_dict()})
    
    return jsonify({"Error": "User is not authorized"}), 403