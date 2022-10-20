from flask import request, redirect
from app import app
from app.db import get_db
import sqlite3 as sql
from flask import g
from app.user import User
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

if __name__ == '__main__':
    app.debug = True
    app.run()

