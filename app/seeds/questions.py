from app.models import db, environment, SCHEMA
from app.models.question import Question
from sqlalchemy.sql import text

# Add questions to seeder:
def seed_questions():
    question_one = Question(
        user_id=2,
        title="New Joe's Valley Road Access",
        question_text="I am trying to find the best way to enter the New Joe's Valley area now since the road has been washed away. Has anyone made it back to the crag since the road has been washed away?"
    )
    question_two = Question(
        user_id=3,
        title="Rain in Red Rocks",
        question_text="Does anyone know if Red Rocks is climbable after it rained? I know the sandstone is super fragile but it's been two days since it rained 1.5 inches. I want to make sure that I won't break anything if I got out and boulder."
    )
    question_three = Question(
        user_id=6,
        title="The Mentor Beta",
        question_text="Can anyone give me beta on the climb, The Mentor, at the VRG? This thing feels hard for the grade and I can't figure out how to pull the roof onto the face. I am 5'8'' and I have a -1 ape index."
    )
    question_four=Question(
        user_id=8,
        title="Stays in Lander",
        question_text="Does anyone have any beta on places to stay in Wild Iris? I was trying to stay for 1 month in the summer but I can't seem to find any place to stay that i reasonably priced. I do not want to camp, but I would like to stay in Lander or close to town"
    )
    question_five=Question(
        user_id=1,
        title="Weighted Pull-ups Intensity",
        question_text="Does anyone have any suggestions for what intensity I should be doing weighted pull-ups at? I want to increase strength and I am not sure how much I should be doing. My max weighted pull-up is 80lbs added and I weigh 140lbs."
    )
    question_six=Question(
        user_id=9,
        title="Climbing Epinephrine",
        question_text="Does anyone know if I need to bring an extra rack for Epinephrine in Red Rocks? I was thinking of doing it this season with my friend and we are both new to trad-climbing."
    )
    question_seven=Question(
        user_id=10,
        title="Looking for Partners in Wild Iris",
        question_text="Does anyone know of people looking for partners for wild iris from 06/30-08-12?"
    )
    question_eight=Question(
        user_id=2,
        title="Partners for Jtree",
        question_text= "I am trying to find a partner for the week of 02/12-02/19 to go sport climbing in Jtree. I have all gear and tons of psyche!"
    )
    question_nine=Question(
        user_id=4,
        title="Yosemite Access",
        question_text="When does the valley open? I am beginning to plan an ascent of the Nose and I have never been to Yosemite."
    )
    question_ten=Question(
        user_id=5,
        title="Lightly Used Trad Gear Sale",
        question_text="Does anyone want to buy some lightly used trad gear. I have a full rack and nuts that are all in really good condition. I thought I would enjoy trad, but I ended up never going."
    )

    db.session.add(question_one)
    db.session.add(question_two)
    db.session.add(question_three)
    db.session.add(question_four)
    db.session.add(question_five)
    db.session.add(question_six)
    db.session.add(question_seven)
    db.session.add(question_eight)
    db.session.add(question_nine)
    db.session.add(question_ten)

    db.session.commit()

    # Add the undo function below:
def undo_questions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.questions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM questions"))
        
    db.session.commit()
