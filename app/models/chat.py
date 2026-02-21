from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

# class ChatConversation(db.Model):
#     __tablename__ = "chat_conversations"

#     if environment == "production":
#         __table_args__ = {"schema": SCHEMA}

    
#     id = db.Column(db.Integer, primary_key=True)

#     user_id = db.Column(
#         db.Integer,
#         db.ForeignKey(
#             add_prefix_for_prod("users.id"),
#             name="fk_chat_conversation_user_id"
#             )
#     )

#     created_at = db.Column(
#         db.DateTime,
#         default = datetime.now(timezone.utc),
#         nullable=False
#     )

#     messages = db.relationship(
#         "ChatMessage",
#         back_populates="conversation",
#         cascade="all, delete-orphan"
#     )

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'user_id': self.user_id,
#             'messages': self.messages,
#             'created_at': self.created_at
#         }

# class ChatMessage(db.Model):
#     __tablename__ = "chat_messages"

#     if environment == "production":
#         __table_args__ = {"schema": SCHEMA} 

#     id = db.Column(db.Integer, primary_key=True)
#     conversation_id = db.Column(
#         db.Integer,
#         db.ForeignKey(
#             add_prefix_for_prod("chat_conversations.id"), 
#             name="fk_chat_messages_conversation_id"),
#         nullable=False
#     )

#     role = db.Column(db.String(20), nullable=False)
#     content = db.Column(db.Text, nullable = False)

#     created_at = db.Column(
#         db.DateTime,
#         default = datetime.now(timezone.utc),
#         nullable=False
#     )

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'role': self.role,
#             'content': self.content,
#             'conversation_id': self.conversation_id,
#             'created_at': self.created_at
#         }

#     conversation = db.relationship(
#         "ChatConversation",
#         back_populates = "messages"
#     )

class ChatConversation(db.Model):
    __tablename__ = "chat_conversations"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            add_prefix_for_prod("users.id"),
            name="fk_chat_conversations_user_id"
        )
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    messages = db.relationship(
        "ChatMessage",
        back_populates="conversation",
        cascade="all, delete-orphan"
    )


class ChatMessage(db.Model):
    __tablename__ = "chat_messages"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    conversation_id = db.Column(
        db.Integer,
        db.ForeignKey(
            add_prefix_for_prod("chat_conversations.id"),
            name="fk_chat_messages_conversation_id"
        ),
        nullable=False
    )

    role = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    conversation = db.relationship(
        "ChatConversation",
        back_populates="messages"
    )