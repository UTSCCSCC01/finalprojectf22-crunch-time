from app.routes import logout
from app.user import User 
from app.db import get_db, close_db

import os
from flask import Flask, current_app

app = Flask(__name__)

app.config.from_mapping(
    DATABASE=os.path.join(app.instance_path, 'db.sqlite')
)

# ensure instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass

from app import db, routes
db.init_app(app)

with app.app_context():
    db = get_db()
    with current_app.open_resource('app/schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    currentSession = [] 
    user1 = 'hello@mail.com'
    password1 = '12345678'
    user2 = 'hi@mail.com'
    password2 = 'password123'

    print('\n')
    print('Try register first user:')
    new_user1 = User.registerUser('first1', 'last1', user1, password1, '123 street1', db)

    print('\n')
    print('Try register second user:')
    new_user2 = User.registerUser('first2', 'last2', user2, password2, '123 street2', db)

    print('\n')
    print('Try register with already used email:')
    new_user3 = User.registerUser('new', 'user', user1, 'password', '123 street1', db)

    print('\n')
    print('Try register with password that is too short:')
    new_user3 = User.registerUser('new', 'user', "email", '123', '123 street1', db)

    print('\n')
    print('Users in database:')
    users = list(map(dict, db.execute("SELECT * FROM users ").fetchall()))
    print(users)

    print('\n')
    print('----------------------------------------')

    print('\n')
    print('Try login first user:')
    loggedIn = User.loginUser(user1, password1, db)
    users = list(map(dict, db.execute("SELECT * FROM loggedInUsers ").fetchall()))
    print(users)
    # print('LoggedIn user info:\nfirstName: %s\nlastName: %s\nemail: %s\naddress: %s' % (loggedIn.getFirstName(), loggedIn.getLastName(), 
    # loggedIn.getEmail(), loggedIn.getAddress()))

    print('\n')
    print('Try logout first user:')
    User.logoutUser(new_user1, db)
    print('Logged in users table:')
    users = list(map(dict, db.execute("SELECT * FROM loggedInUsers ").fetchall()))
    print(users)

    print('\n')
    print('Try login with wrong password:')
    User.loginUser(user1, password2, db)
    print('Logged in users table:')
    users = list(map(dict, db.execute("SELECT * FROM loggedInUsers ").fetchall()))
    print(users)

    print('\n')
    print('Try login with non existant account:')
    User.loginUser('123@mail.com', '123123', db)
    print('Logged in users table:')
    users = list(map(dict, db.execute("SELECT * FROM loggedInUsers ").fetchall()))
    print(users)

    print('\n')
    print('Try logout second user:')
    User.logoutUser(new_user2, db)
    print('\n')


    close_db()
