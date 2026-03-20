from app.models import db, environment, SCHEMA
from app.models.tag import question_tags
from sqlalchemy.sql import text

# Add question_tags seeder
def seed_question_tags():
    stmt = question_tags.insert().values([
        {"tag_id": 1, "question_id": 2},
        {"tag_id": 2, "question_id": 3},
        {"tag_id": 3, "question_id": 1},
        {"tag_id": 2, "question_id": 1},
        {"tag_id": 3, "question_id": 2},
        {"tag_id": 6, "question_id": 2},
        {"tag_id": 7, "question_id": 10},
        {"tag_id": 9, "question_id": 8},
        {"tag_id": 8, "question_id": 5},
        {"tag_id": 10, "question_id": 7},
        {"tag_id": 4, "question_id": 6}
    ])

    db.session.execute(stmt)

    db.session.commit()

# Undo seeder function
def undo_question_tags():
    if environment == "production":
        db.session.execute(f"Truncate table {SCHEMA}.question_tags RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM question_tags"))

    db.session.commit()