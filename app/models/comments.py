from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("questions.id")), nullable=False)
    comment_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'comment_text': self.comment_text,
            'user_id': self.user_id,
            'question_id': self.question_id,
            'created_at': self.created_at
        }
    
    # Add relationships here:
    user_comment = db.relationship("User", back_populates="comments")
    question = db.relationship("Question", back_populates="comment")