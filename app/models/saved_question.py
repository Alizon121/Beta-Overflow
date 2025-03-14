from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

class SavedQuestion(db.Model):
    __tablename__="saved_questions"

    if environment == "production":
      __table_args__ = (
        db.UniqueConstraint('user_id', 'question_id', name='unique_saved_question'),
        {'schema': SCHEMA}
    )
    else:
      __table_args__ = (db.UniqueConstraint('user_id', 'question_id', name='unique_saved_question'),)
      
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False, primary_key=True)
    question_id=db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("questions.id")), nullable=False, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)        
        
    def to_dict(self):
            return {
                'user_id': self.user_id,
                'question_id': self.question_id,
                'created_at': self.created_at
            }
        
# # Add relationships
    user = db.relationship("User", back_populates="saved_questions")
    question = db.relationship("Question", back_populates="saved_questions")