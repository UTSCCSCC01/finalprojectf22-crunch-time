from flask import request, redirect
from app import app
from app.db import get_db
import sqlite3 as sql
from flask import g
from app.user import User
from app.utils import rows_to_dicts
from app.groups import search as gsearch

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
        db.execute('INSERT INTO Groups (group_name, skill_level) VALUES ("Best group", ?)',
            (data['skillLevel'],))
        db.execute('INSERT INTO User_in_group (user_id, group_id) VALUES (1, LAST_INSERT_ROWID())')
        db.commit()
        
    return {'messages': [request.method]}


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
        user_id = data['user_id']
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


if __name__ == '__main__':
    app.debug = True
    app.run()

