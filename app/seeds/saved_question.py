from app.models import db, environment, SCHEMA
from app.models.saved_question import SavedQuestion
from sqlalchemy.sql import text

# Add saved_questions seeder
def seed_saved_questions():
    saved_question_one = SavedQuestion(
        user_id = 4,
        question_id = 10
    )
    saved_question_two = SavedQuestion(
        user_id = 4,
        question_id = 5
    )
    saved_question_three = SavedQuestion(
        user_id = 2,
        question_id = 3
    )
    saved_question_four = SavedQuestion(
        user_id = 2,
        question_id = 10
    )
    saved_question_five = SavedQuestion(
        user_id = 2,
        question_id = 6
    )
    saved_question_six = SavedQuestion(
        user_id = 10,
        question_id = 1
    )
    saved_question_seven = SavedQuestion(
        user_id = 8,
        question_id = 1
    )
    saved_question_eight = SavedQuestion(
        user_id = 9,
        question_id = 3
    )
    saved_question_nine = SavedQuestion(
        user_id = 7,
        question_id = 1
    )
    saved_question_ten = SavedQuestion(
        user_id = 1,
        question_id = 3
    )
    

    db.session.add(saved_question_one)
    db.session.add(saved_question_two)
    db.session.add(saved_question_three)
    db.session.add(saved_question_four)
    db.session.add(saved_question_five)
    db.session.add(saved_question_six)
    db.session.add(saved_question_seven)
    db.session.add(saved_question_eight)
    db.session.add(saved_question_nine)
    db.session.add(saved_question_ten)

    db.session.commit()

def undo_saved_questions():
    if environment == "production":
        db.session.execute(f"Truncate table {SCHEMA}.saved_questions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM saved_questions"))

    db.session.commit()