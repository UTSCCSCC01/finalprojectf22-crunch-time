import sqlite3

import click
from flask import current_app, g

#Changed up slightly as the other version was not working
def get_db():
    """Get a connection to the SQLite database."""
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

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
