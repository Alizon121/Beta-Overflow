from flask.cli import AppGroup
from .users import seed_users, undo_users
from .questions import seed_questions, undo_questions
from .comments import seed_comments, undo_comments
from.saved_question import seed_saved_questions, undo_saved_questions

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_questions()
        undo_comments()
        undo_saved_questions()
    seed_users()
    seed_questions()
    seed_comments()
    seed_saved_questions()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    # Add other undo functions here
    undo_questions()
    undo_comments()
    undo_saved_questions()
