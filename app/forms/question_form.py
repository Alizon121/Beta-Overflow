from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Length

class QuestionForm(FlaskForm):
    title=StringField("Title", validators=[DataRequired(message="Title is required")])
    question_text=TextAreaField("Add Question", validators=[DataRequired(message="Question is required"), Length(min=25, message="Question must be a minimum of 25 characters")])
    # date=StringField("Date", validators=[DataRequired(message="Date is required")])
    submit= SubmitField("Submit")
