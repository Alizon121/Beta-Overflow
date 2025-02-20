from app.models import db, environment, SCHEMA
from app.models.comments import Comment
from sqlalchemy.sql import text

# Provide seed_comment function below:
def seed_comments():
    comment_one= Comment(
        user_id = 1,
        question_id = 2,
        comment_text="If the ground underneath the boulder is still wet, then it is best to stay away from climbing that boulder. I would recommend looking for a sunny boulder if you are looking to get out."
    )
    comment_two=Comment(
        user_id=3,
        question_id=1,
        comment_text="The roads are currently being worked on and the park service said that there should be access to the area within the next few weeks. I would recommend looking on the FB page or the forest service website for updates."
    )
    comment_three=Comment(
        user_id=10,
        question_id=3,
        comment_text="The beta will depend on the style that you are most comfortable with. There is a dyno beta and there is a foot-on beta, but I prefer dynoing to the jug at the lip and then working my feet that way. The other beta requires a toe hook and then a bicycle that I found too difficult. I am 5'9'' and my ape is +1."
    )
    comment_four=Comment(
        user_id=1,
        question_id=6,
        comment_text="Yes, I would take two racks up on Epi. If this is one of your first trad routes, then I would recommend doing another multi-pitch to build some experience. Epi is notorious for spitting new trad climbers off because it is technical, spicy, and long."
    )
    comment_five=Comment(
        user_id=8,
        question_id=2,
        comment_text="I probably would make sure that you wait at least one more day. With the amount of rain Red Rocks just got, it would be safe to ensure that the moisture in the rock dissipates completely."
    )
    comment_six=Comment(
        user_id=5,
        question_id=4,
        comment_text="I would check the FB page to see if anyone has any postings up."
    )
    comment_seven=Comment(
        user_id=3,
        question_id=4,
        comment_text="I would check airBnB or craigslist. There might be something there!"
    )
    comment_eight=Comment(
        user_id=2,
        question_id=4,
        comment_text="There might be a listing at one of the coffee shops if you are in town."
    )
    comment_nine=Comment(
        user_id=10,
        question_id=5,
        comment_text="If you want to build strength, I would suggest keeping the intensity at 80% of your max and being consistent (e.g. doing weighted pull-ups 2x per week)."
    )
    comment_ten=Comment(
        user_id=9,
        question_id=10,
        comment_text= "How much are you selling the gear for? I would be willing to buy if I could check out the gear and if they are reasonably priced!"
    )

    db.session.add(comment_one)
    db.session.add(comment_two)
    db.session.add(comment_three)
    db.session.add(comment_four)
    db.session.add(comment_five)
    db.session.add(comment_six)
    db.session.add(comment_seven)
    db.session.add(comment_eight)
    db.session.add(comment_nine)
    db.session.add(comment_ten)

    db.session.commit()

# Undo function
def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()