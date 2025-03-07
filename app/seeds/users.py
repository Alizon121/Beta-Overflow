from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', first_name="Demo", last_name="User", email='demo@aa.io', password='password')
    marnie = User(
        username='marnie', first_name="Marnie", last_name="User", email='marnie@aa.io', password='password')
    bobbie = User(
        username='bobbie', first_name="Bobbie", last_name="User", email='bobbie@aa.io', password='password')
    jojo = User(
        username='jojo', first_name="Jojo", last_name="User", email='jojo@aa.io', password='password')
    momo = User(
        username='momo', first_name="Momo", last_name="User", email='momo@aa.io', password='password')
    aaron = User(
        username='Aaron1', first_name="Aaron", last_name="User", email='aaron@aa.io', password='password')
    adam = User(
        username='Adam1', first_name="Adam", last_name="User", email='adam@aa.io', password='password')
    jacob = User(
        username='Jacob1', first_name="Jacob", last_name="User", email='jacob@aa.io', password='password')
    felipe = User(
        username='Felipe1', first_name="Felipe", last_name="User", email='felipe@aa.io', password='password')
    angie = User(
        username='Angie1', first_name="Angie", last_name="User", email='angie@aa.io', password='password')    

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(jojo)
    db.session.add(momo)
    db.session.add(aaron)
    db.session.add(adam)
    db.session.add(jacob)
    db.session.add(felipe)
    db.session.add(angie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
