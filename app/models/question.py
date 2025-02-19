from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Question(db.Model):
    __tablename__ = 'questions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'question_text': self.question_text,
            'created_by': self.created_by
        }
    
    # Add relationships here:
    user = db.relationship("User", back_populates="question")
    comment = db.relationship("Comment", back_populates="question")