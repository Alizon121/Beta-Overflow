from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Question(db.Model):
    __tablename__ = 'questions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'question_text': self.question_text,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    # Add relationships here:
    user = db.relationship("User", back_populates="question")
    comment = db.relationship("Comment", back_populates="question", cascade="all, delete-orphan")

    # Join Table Relationship
    # user = db.relationship(
    #     "User", 
    #     secondary = "saved_questions",
    #     back_populates="saved_question",
    #     cascade="all, delete"
    #     )
    saved_questions = db.relationship("SavedQuestion", back_populates="question")