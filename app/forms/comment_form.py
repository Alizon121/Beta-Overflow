from flask_wtf import FlaskForm
from wtforms import TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length

class CommentForm(FlaskForm):
    comment_text=TextAreaField("Add Comment", validators=[DataRequired(message="Comment is required"), Length(min=15, message="Comment must be a minimum of 15 characters.")])
    submit=SubmitField("Submit")