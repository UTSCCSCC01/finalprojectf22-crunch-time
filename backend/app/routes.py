from flask import Flask, render_template, request, redirect, url_for, session
from flask import jsonify;
from . import app
from app.db import get_db
import sqlite3 
import sqlite3 as sql
from flask import g
from app.user import User
from flask_socketio import SocketIO, join_room, leave_room, send

"""@app.route('/')
def route():
    return 'Hi!'"""


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
    Email = request.json['Email']
    Password = request.json['Password']
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
    User.loginUser(email, password, db)
    return redirect('/')

@app.route('/logout', methods=['GET', 'POST'])
def logout():
    db = get_db()
    User.logoutUser(db)
    return redirect('/')

@app.route('/register', methods=['GET', 'POST'])
def register():
    print("a")
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

