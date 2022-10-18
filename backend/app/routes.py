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
    db = get_db()
    if request.method == 'POST':
        email = request.form['email']
        firstName = request.form['firstName']
        lastName = request.form['lastName']
        password = request.form['password']
        address = request.form['address']
    User.registerUser(firstName, lastName, email, password, address, db)
    return redirect('/register')

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
        # db.execute('INSERT INTO Groups ( group_id, group_name) VALUES (1, "Best group")')
        # db.execute('INSERT INTO User_in_group ( user_id, group_id) VALUES (1, 1)')
        # db.commit()
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

