from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint


# Create the JOIN table for quesitons and tags
question_tags = db.Table(
     "question_tags",
     db.Model.metadata,
     db.Column("tag_id", db.Integer, db.ForeignKey(add_prefix_for_prod("tags.id")), primary_key=True),
     db.Column("question_id", db.Integer, db.ForeignKey(add_prefix_for_prod("questions.id")), primary_key=True)
)

if environment == "production":
        question_tags.schema = SCHEMA

class Tag(db.Model):
    __tablename__="tags"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(80), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
            return {
                'id': self.id,
                'tag_name': self.tag_name,
                'user_id': self.user_id,
                'created_at': self.created_at,
                'updated_at': self.updated_at
            }
    

    # Add the relationship for one-to-many:
    user_tag = db.relationship("User", back_populates="tags")

    # Add the relationships for the JOIN:
    tag_questions = db.relationship(
        "Question", # Name of table
        secondary=question_tags, # name of the join table
        back_populates="tags", # variable that relationship refers to in other table
        )