"""create_saved_questions_table

Revision ID: 42a958e5e01b
Revises: 4caa1507cdd1
Create Date: 2025-03-14 04:24:06.452167

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import func

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = '42a958e5e01b'
down_revision = '4caa1507cdd1'
depends_on=("ffdc0a98111c", "4caa1507cdd1")

branch_labels = None


def upgrade():
    op.create_table('saved_questions',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('question_id', sa.Integer(), nullable=False),
    sa.Column('bookmarked', sa.Boolean(), default=False, nullable=False),
    sa.Column('created_at', sa.DateTime(), default=func.now(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), default=func.now(), nullable=False, onupdate=func.now()),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete="CASCADE"),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete="CASCADE"),
    sa.PrimaryKeyConstraint('user_id', 'question_id')
    )

if environment == "production":
        op.execute(f"ALTER TABLE saved_questions SET SCHEMA {SCHEMA};")

# End alembic commands

def downgrade():
    op.drop_table("saved_questions")

# End alembic commands
