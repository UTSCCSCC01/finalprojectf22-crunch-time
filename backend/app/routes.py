from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from . import app
from app.db import get_db
import sqlite3 as sql
from flask import g
from app.user import User
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session
import json
from app.utils import rows_to_dicts
from app.groups import search as gsearch

"""@app.route('/')
def route():
    return 'Hi!'"""

app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
server_session = Session(app)
#db.init_app(app)

@app.route('/user', methods=['GET', 'POST'])
def get_user():

    if 'user_id' != None :
        return jsonify({'user_id': session['user_id']})
    return 'bad request!', 400

@app.route('/user_in_group/<group_id>', methods=['GET'])
def user_in_group(group_id):
    user_id = session.get('user_id')
    try:
        user_id = int(user_id)
        group_id = int(group_id)
    except ValueError:
        return 'malformed user or group IDs', 400
    db = get_db()
    res = db.execute('SELECT * FROM User_in_group WHERE user_id = ? AND group_id = ?',
        (user_id, group_id))
    return jsonify({'joined': not (res.fetchone() is None)})
    


@app.route('/example', methods=['GET', 'POST'])
def example():
    db = get_db()
    if request.method == 'POST':
        db.execute('INSERT INTO Example (contents) VALUES (?)', (request.form['message'],))
        db.commit()
    messages = db.execute('SELECT * FROM Example').fetchall()
    return {'messages': list(map(dict, messages))}

@app.route('/login', methods=['GET', 'POST'])
def login():

    db = get_db()
    print(request.json)
    Email = request.json['Email']
    Password = request.json['Password']
    messages =  db.execute("SELECT * FROM users WHERE email = (?)", [Email]).fetchall()
    # print(temp['messages'][0]['password'])
    if request.method == 'POST':
        if messages!=None:
            temp = {'messages': list(map(dict, messages))}
            if Password == str(temp['messages'][0]['password']):
                session['user_id'] = temp['messages'][0]['user_id']
                session['email'] = Email
                return temp
    return 'bad request!', 400


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    session.pop("email")
    return "200"



@app.route('/register', methods=['GET', 'POST'])
def register():
    db = get_db()
    FirstName = str(request.json['FirstName'])
    LastName = str(request.json['LastName']) 
    Email = str(request.json['Email'])
    Password = str(request.json['Password'])
    Address = str(request.json['Address'])
    if request.method == 'POST':
        db.execute('INSERT INTO Users (firstName, lastName, email, password, address) VALUES (?, ?, ?, ?, ?)', [FirstName, LastName, Email, Password, Address])

        db.commit()
        return {'messages':1}

@app.route('/search', methods=['GET', 'POST'])
def search():
    db = get_db()
    if request.method == 'POST':
        if (request.form['loc'] == "true"):
            messages = gsearch(db, request.form['groupName'], float(request.form['lat']), float(request.form['long']), float(request.form['dist']))
        else:
            messages = db.execute("SELECT * FROM Groups WHERE group_name like ?", ["%" + request.form['groupName'] + "%"] ).fetchall()
        
    else:
        messages = db.execute('SELECT * FROM Groups').fetchall()
    return {'messages': list(map(dict, messages))}
    
    
@app.route('/Create_Group', methods=['POST', 'GET'])
def Create_Group():
    db = get_db()
    if request.method == 'POST':
        data = request.get_json()
        for elem in data:
            print(elem, type(elem))
        
        if (data["loc"] == "true"):
            db.execute('INSERT INTO Groups (group_name, skill_level, latitude, longitude) VALUES (?, ?)', 
            (data["group_name"], data['skillLevel'], data['lat'], data['long'],))
        else:
            db.execute('INSERT INTO Groups (group_name, skill_level) VALUES (?, ?)', (data["group_name"], data['skillLevel'],))
        db.execute('INSERT INTO User_in_group (user_id, group_id) VALUES (1, LAST_INSERT_ROWID())')
        db.commit()
        
    return {'messages': [request.method]}
app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

@socketIo.on("message")
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)
    return None
@socketIo.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room.', to=room)

@socketIo.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)

@app.route('/account_information', methods=['GET', 'POST'])
def account_information():
    db = get_db()
    if request.method == 'GET':
        if 'user_id' in session:
            user_id = session['user_id']
            messages = db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)).fetchall()
            info = list(map(dict, messages))
            group_id = db.execute("SELECT group_id FROM User_in_group WHERE user_id = ?", (user_id,)).fetchall()
            info[0]['groups']=[]
            if len(group_id) > 0:
                for i in range(len(group_id)):
                    id = group_id[i][0]
                    groups = db.execute("SELECT group_name FROM Groups WHERE group_id = ?", (id,)).fetchall()
                    for group in groups:
                        info[0]['groups'].append(group[0])
                        if i < len(group_id) - 1:
                            info[0]['groups'].append(', ')
    return {'messages': info}

@app.route('/edit_info', methods=['GET', 'POST'])
def edit_account():
    db = get_db()
    user_id = session['user_id']
    if request.method == 'POST':
        FirstName = str(request.json['FirstName'])
        LastName = str(request.json['LastName']) 
        Email = str(request.json['Email'])
        Password = str(request.json['Password'])
        Address = str(request.json['Address'])
        if len(FirstName) > 0 :
            session['firstName'] = FirstName
            db.execute("UPDATE Users SET firstName = ? WHERE user_id = ?", (FirstName, user_id),)
        if len(LastName) > 0 :
            session['lastName'] = LastName
            db.execute("UPDATE Users SET lastName = ? WHERE user_id = ?", (LastName, user_id),)
        if len(Email) > 0 :
            session['email'] = Email
            db.execute("UPDATE Users SET email = ? WHERE user_id = ?", (Email, user_id),)
        if len(Password) > 0 :
            session['password'] = Password
            db.execute("UPDATE Users SET password = ? WHERE user_id = ?", (Password, user_id),)
        if len(Address) > 0 :
            session['address'] = Address
            db.execute("UPDATE Users SET address = ? WHERE user_id = ?", (Address, user_id),)
        db.commit()
        messages =  db.execute("SELECT * FROM users WHERE user_id = (?)", [user_id,]).fetchall()
        temp = {'messages': list(map(dict, messages))}['messages'][0]
        return temp

@app.route('/account_info_authentification', methods=['GET', 'POST'])
def account_info_authentifaction():
    if request.method == 'POST':
        Password = str(request.json['Password'])
        if (Password==session['password']):
            temp = {'password': True}
        else:
            temp = {'password': False}
        return temp

@app.route('/join_group', methods=['POST', 'GET'])
def join_group():
    db = get_db()
    # record user joining the group into the database
    if request.method == 'POST':
        data = request.get_json()
        user_id = session.get('user_id')
        if user_id is None:
            return 'invalid user ID', 400
        group_id = data['group_id']
        db.execute('INSERT OR IGNORE INTO User_in_group (user_id, group_id) VALUES (?, ?)',
            (user_id, group_id))
        db.commit()
        #print(f'user {user_id} is joining group {group_id}')

    groups = db.execute('SELECT group_id, group_name FROM Groups').fetchall()
    groups = rows_to_dicts(groups)
    for group in groups:
        users = db.execute(
            'SELECT user_id, email FROM User_in_group NATURAL JOIN Users WHERE group_id = ?',
            (group['group_id'],)
        ).fetchall()
        group['users'] = rows_to_dicts(users)
    all_users = db.execute('SELECT user_id, email FROM Users').fetchall()
    return {'groups': groups, 'users': rows_to_dicts(all_users)}

@app.route('/view_group/<group_id>', methods=['GET'])
def group_info(group_id):
    try:
        group_id = int(group_id)
    except ValueError:
        return 'group not found', 404
    db = get_db()
    group = db.execute('SELECT * FROM Groups WHERE group_id = ?', (group_id,)).fetchone()
    if group is None:
        return 'group not found', 404
    group = dict(group)
    members = db.execute('SELECT user_id, firstName, lastName FROM Users NATURAL JOIN User_in_group WHERE group_id = ?',
        (group_id,)).fetchall()
    group['members'] = rows_to_dicts(members)
    return jsonify(group)
    
@app.route('/contact_us', methods=['POST', 'GET'])
def contact_us():
    db = get_db()
    if request.method == 'POST':
        firstName = str(request.json['FirstName'])
        lastName = str(request.json['LastName'])
        email= str(request.json['Email'])
        message= str(request.json['Message'])
        db.execute('INSERT INTO Questions (firstName, lastName, email, message) VALUES (?, ?, ?, ?)',
            (firstName, lastName, email, message))
        db.commit()
    return {'messages':1}

if __name__ == '__main__':
    
    socketIo.run(app)
    app.run()
    app.debug = True

