from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class TagForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired(message="Name is required")])
    submit = SubmitField("Submit")