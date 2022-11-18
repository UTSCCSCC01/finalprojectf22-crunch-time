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
#Stores all the usernames. Eventually each index will represent users in a group. Will make it a dictionary eventually
users = {'username': []}

#db.init_app(app)

@app.route('/user', methods=['GET', 'POST'])
def get_user():
    if len(session) > 1 :
        return jsonify(session)
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
    res2 = db.execute('SELECT size FROM Groups WHERE group_id = ?',
        (group_id,)).fetchone()
    if res2 is None:
        return 'unknown group ID', 404
    else:
        size = res2['size']
    member_count = db.execute('SELECT COUNT(*) AS count FROM User_in_group WHERE group_id = ?',
        (group_id,)).fetchone()['count']
    
    return jsonify({
        'joined': not (res.fetchone() is None),
        'full': member_count >= size
    })

@app.route('/login', methods=['GET', 'POST'])
def login():

    db = get_db()
    Email = request.json['Email']
    Password = request.json['Password']
    if request.method == 'POST':
        messages =  db.execute("SELECT * FROM users WHERE email = (?) AND password = (?)", [Email, Password]).fetchall()
        temp = {'messages': list(map(dict, messages))}['messages']
        if len(temp) >  0 :
            temp = {'messages': list(map(dict, messages))}['messages'][0]
            session['user_id'] = temp['user_id']
            session['firstName'] = temp['firstName']
            session['lastName'] = temp['lastName']
            session['email'] = Email
            session['password'] = Password
            session['address'] = temp['address']
            return temp

@app.route("/getGroupInfo", methods=["GET",  'POST'])
def getGroupInfo():
    db = get_db()
    group_info = db.execute('SELECT user_name, context, time_stamp FROM messages WHERE group_id = (?)', 
    [request.json['groupID']]).fetchall()
    db.commit()
    return list(map(list, group_info))



@app.route("/logout", methods=["POST"])
def logout_user():
    username = request.json['username']
    if username in users['username']:
        users['username'].remove(username)
    print(users)
    #send(users, broadcast=True)
    session.clear()
    return "200"

@app.route("/updateAccount", methods=["POST"])
def updateAccount():

    db = get_db()
    FirstName = str(request.json['firstName'])
    LastName = str(request.json['lastName']) 
    Email = str(request.json['email'])
    #Password = str(request.json['password'])
    Address = str(request.json['address'])
    if request.method == 'POST':
        db.execute('UPDATE Users SET firstName = (?), lastName = (?), address = (?) WHERE email = (?)', [FirstName, LastName, Address, Email])

        db.commit()
    return "200"

@app.route("/deleteAccount", methods=["DELETE"])
def deleteAccount():
    db = get_db()
    Email = str(request.json['email'])
    user_id = request.json['user_id']
    print (request.method)
    if request.method == 'DELETE':
        db.execute('DELETE FROM users where email = (?)', [Email])
        db.execute('DELETE FROM User_in_group where user_id = (?)', [user_id])
        db.commit()
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
        activity_id = int(request.form['activity_id'])
        if (request.form['loc'] == "true"):
            messages = gsearch(db, request.form['groupName'], float(request.form['lat']), float(request.form['long']), 
            float(request.form['dist']), activity_id)
        else:
            messages = db.execute("SELECT * FROM Groups WHERE group_name like ? AND (? = 0 OR activity_id = ?)", 
            ["%" + request.form['groupName'] + "%", activity_id, activity_id] ).fetchall()
        
    else:
        messages = db.execute('SELECT * FROM Groups').fetchall()
    return {'messages': list(map(dict, messages))}
    
    
@app.route('/Create_Group', methods=['POST', 'GET'])
def Create_Group():
    db = get_db()
    if request.method == 'POST':
        data = request.get_json()
        for elem in data:
            print(elem, type(data[elem]), data[elem])
        
        if (data["loc"]):
            db.execute('INSERT INTO Groups (group_name, skill_level, latitude, longitude, activity_id, activity_name, size) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            (data["group_name"], data['skillLevel'], data['lat'], data['long'], data['activity_id'], data['activity_name'], data['sizeLimit']))
        else:

            db.execute('INSERT INTO Groups (group_name, skill_level, activity_id, activity_name, size, group_creator) VALUES (?, ?, ?, ?, ?, ?)', 
            (data["group_name"], data['skillLevel'], data['activity_id'], data['activity_name'], data['sizeLimit'], data['user_id']))
        messages = db.execute("SELECT * FROM Groups WHERE group_id =  LAST_INSERT_ROWID()").fetchall()
        db.execute('INSERT INTO User_in_group (user_id, group_id) VALUES (?, LAST_INSERT_ROWID())', [data['user_id']])  
        db.commit()
        resp = {'messages': list(map(dict, messages))}
        return jsonify(resp)
    else:
        activities = db.execute("SELECT id, name FROM Activities").fetchall()
        return {'activities': list(map(dict, activities))}  
        
@app.route('/get_acts', methods=['GET'])
def get_acts():
    db = get_db()
    #user_id = request.json['user_id']
    if request.method == 'GET':
        activities = db.execute("SELECT id, name FROM Activities").fetchall()
        return {'activities': list(map(dict, activities))} 

@app.route('/tracking/<user_id>', methods=['GET', 'POST'])
def tracking(user_id):
    db = get_db()
    if request.method == 'GET':
        user_id = int(user_id)
        activities = db.execute("SELECT activity_id FROM User_follows_activity WHERE user_id = ?", [user_id]).fetchall()
        return {'tracked_activities': list(map(dict, activities))} 
    elif request.method == 'POST':
        user_id = int(user_id)
        return

@app.route('/get_matching_users/<activity_id>/<user_id>', methods=['GET'])
def get_matching_users(activity_id, user_id):
    db = get_db()
    if request.method == 'GET':
        user_id = int(user_id)
        activity_id = int(activity_id)
        users = db.execute("""SELECT user_id, firstName, lastName FROM Users NATURAL JOIN User_follows_activity
            WHERE activity_id = ? and user_id != ?""", [activity_id, user_id,]).fetchall()
        return {'users': list(map(dict, users))} 
        
app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'
@socketIo.on("message")
def handleMessage(msg):
    db = get_db()
    db.execute('INSERT INTO messages (user_id, group_id, user_name, time_stamp, context) VALUES (?, ?, ?, ?, ?)', 
            (msg["user"][3], msg['groupID'], msg['user'][0], msg['user'][2], msg['user'][1]))
    db.commit()       
    send(msg, broadcast=True, room=msg["groupID"])
    return None
@socketIo.on('join')
def on_join(data):
    # username = data['username']

    if data['userName'] not in users['username']:
        users['username'].append(data['userName'])
    join_room(data['groupID'])
    print(data)
    send(users, broadcast=True, room=data['groupID'])
    return None
@socketIo.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)

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
        # check if group is full
        res = db.execute('SELECT size FROM Groups WHERE group_id = ?',
            (group_id,)).fetchone()
        if res is None:
            return 'unknown group ID', 404
        else:
            size = res['size']
        member_count = db.execute('SELECT COUNT(*) AS count FROM User_in_group WHERE group_id = ?',
            (group_id,)).fetchone()['count']
        if member_count >= size:
            return 'group is full', 400
        # add to group
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

@app.route('/add_friend/<friend_id>', methods=['POST'])
def add_friend(friend_id):
    db = get_db()
    user_id = session.get('user_id')
    db.execute('INSERT INTO friendLists (user_id, friend_id) VALUES (?, ?)', (user_id, friend_id,))
    db.commit()
    return {'messages': 1} 

@app.route('/remove_friend/<friend_id>', methods=['DELETE'])
def remove_friend(friend_id):
    db = get_db()
    user_id = session.get('user_id')
    db.execute('DELETE FROM friendLists WHERE user_id = ? AND friend_id = ?', (user_id, friend_id,))
    db.commit()
    return {'messages': 1}

@app.route('/friend_list/<user_id>', methods=['GET'])
def friend_list(user_id):
    db = get_db()
    friend_list = []
    friends = db.execute('SELECT friend_id FROM friendLists WHERE user_id = ?',
        (user_id,)).fetchall()
    for i in range(len(friends)):
        friend_info = db.execute('SELECT user_id, firstName, lastName FROM Users WHERE user_id = ?',
        (friends[i][0],)).fetchall()
        friend_info = dict(friend_info[0])
        friend_list.append(friend_info)
    return {'friends': friend_list}

@app.route('/is_friend/<user_id>', methods=['GET'])
def is_friend(user_id):
    cur_user_id = session.get('user_id')
    if cur_user_id is None:
        return 'need to be logged in', 401
    # can't friend yourself
    if int(cur_user_id) == int(user_id):
        return jsonify({'isFriend': None})
    db = get_db()
    res = db.execute(
        'SELECT EXISTS(SELECT * FROM friendLists '
        'WHERE user_id = ? AND friend_id = ?) as isFriend',
        (cur_user_id, user_id)
    ).fetchone()
    return jsonify({'isFriend': res['isFriend']})

@app.route('/profile_info/<user_id>', methods=['GET'])
def profile_info(user_id):
    cur_user_id = session.get('user_id')
    if cur_user_id is None:
        return 'need to be logged in', 401
    db = get_db()
    u = db.execute('SELECT * FROM Users WHERE user_id = ?', (user_id,)).fetchone()
    if u is None:
        return 'user not found', 404
    friend_count = db.execute(
        'SELECT COUNT(*) AS count FROM friendLists WHERE user_id = ?', (user_id,)
    ).fetchone()['count']
    interests = db.execute(
        'SELECT a.name AS name FROM User_follows_activity u '
        'JOIN Activities a ON u.activity_id = a.id '
        'WHERE u.user_id = ?',
        (user_id,)
    ).fetchall()
    mutual_friends = db.execute(
        'SELECT u.user_id AS userID, u.firstName AS firstName, u.lastName AS lastName '
        'FROM friendLists theirs '
        'JOIN friendLists mine ON theirs.friend_id = mine.friend_id '
        'JOIN Users u ON mine.friend_id = u.user_id '
        'WHERE theirs.user_id = ? AND mine.user_id = ?',
        (user_id, cur_user_id)
    ).fetchall()
    return jsonify({
        'firstName': u['firstName'],
        'lastName': u['lastName'],
        'friendCount': friend_count,
        'interests': list(map(lambda r: r['name'], interests)),
        'mutualFriends': rows_to_dicts(mutual_friends)
    })

@app.route('/leave_group/<group_id>', methods=['DELETE'])
def leave_group(group_id):
    db = get_db()
    current_user = session.get('user_id')

    db.execute('DELETE FROM User_in_group WHERE user_id = ? AND group_id = ?', (current_user, group_id,))
    db.commit()
    return {'messages': 1}

if __name__ == '__main__':
    
    socketIo.run(app)
    app.run()
    app.debug = True

