from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from . import app
from app.db import get_db
import sqlite3 
import sqlite3 as sql
from flask import g
from app.user import User
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from flask_session import Session
import json

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
    print(temp['messages'][0]['password'])
    if request.method == 'POST':
        if messages!=None:
            temp = {'messages': list(map(dict, messages))}
            if Password == str(temp['messages'][0]['password']):
                session['user_id'] = Email
                return temp
    return 'bad request!', 400


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
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
        messages = db.execute("SELECT * FROM Groups WHERE group_name like ?", ["%" + request.form['message'] + "%"] ).fetchall()
    else:
        messages = db.execute('SELECT * FROM Groups').fetchall()
    return {'messages': list(map(dict, messages))}
    
    
@app.route('/Create_Group', methods=['POST', 'GET'])
def Create_Group():
    db = get_db()
    if request.method == 'POST':
        db.execute('INSERT INTO Groups (group_name,Size) VALUES ("Best group",1000)')
        #db.execute('INSERT INTO User_in_group ( user_id, group_id) VALUES (1, 1)')
        db.commit()
        return {'messages':1}
        
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
if __name__ == '__main__':
    
    socketIo.run(app)
    app.run()
    app.debug = True

