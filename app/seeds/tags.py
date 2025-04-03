from app.models import db, environment, SCHEMA
from app.models.tag import Tag
from sqlalchemy.sql import text

# Provide seed_tags function below:
def seed_tags():
    tag_one = Tag(
        user_id = 1,
        tag_name = "Bouldering"
    )
    tag_two = Tag(
        user_id = 1,
        tag_name = "Access"
    )
    tag_three = Tag(
        user_id = 1,
        tag_name = "Joe's Valley"
    )
    tag_four = Tag(
        user_id = 2,
        tag_name = "Climbing"
    )
    tag_five = Tag(
        user_id = 3,
        tag_name = "Partners"
    )
    tag_six = Tag (
        user_id = 4,
        tag_name = "Time"
    )
    tag_seven = Tag(
        user_id = 9,
        tag_name = "Help"
    )
    tag_eight = Tag(
        user_id = 10,
        tag_name = "Living"
    )
    tag_nine = Tag(
        user_id = 8,
        tag_name = "Music"
    )
    tag_ten = Tag(
        user_id = 7,
        tag_name = "Lime Disease"
    )
    
    db.session.add(tag_one)
    db.session.add(tag_two)
    db.session.add(tag_three)
    db.session.add(tag_four)
    db.session.add(tag_five)
    db.session.add(tag_six)
    db.session.add(tag_seven)
    db.session.add(tag_eight)
    db.session.add(tag_nine)
    db.session.add(tag_ten)

    db.session.commit()

# Undo function
def undo_tags():
     if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tags RESTART IDENTITY CASCADE;")
     else:
        db.session.execute(text("DELETE FROM tags"))
        
     db.session.commit()