import sqlite3

import click
from flask import current_app, g

#Changed up slightly as the other version was not working
def get_db():
    db = getattr(g, '_database', None)
    #creates database
    if db is None:
        db = g._database = sqlite3.connect("database.db")
    return db

def close_db(e=None):
    """Close the connection to the database."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    """Initialize the database."""
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
def init_db_command():
    """Clear existing data and set up the database."""
    init_db()
    click.echo('Database initialized.')

def init_app(app):
    """Registers database-handing functions with the app."""
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
