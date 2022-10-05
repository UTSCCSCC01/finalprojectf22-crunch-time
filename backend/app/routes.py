from flask import request

from app import app
from app.db import get_db
from app.user import User


@app.route('/example', methods=['GET', 'POST'])
def example():
    db = get_db()
    if request.method == 'POST':
        db.execute('INSERT INTO Example (contents) VALUES (?)',
            (request.form['message'],))
        db.commit()
    messages = db.execute('SELECT * FROM Example').fetchall()
    return {'messages': list(map(dict, messages))}

# Register
#########
@app.route('/register', methods=['GET', 'POST'])
def register():
    db = get_db()
    if request.method == 'POST':
        email = request.form['email']
        firstName = request.form['firstName']
        lastName = request.form['lastName']
        password = request.form['password']
        address = request.form['address']
    return registerUser(firstName, lastName, email, password, address, db)

def registerUser(firstName, lastName, email, password, address, db):
    similar = db.execute('SELECT * FROM usersExample WHERE email = \'{email}\'').fetchall()
    if len(similar)!=0:
    # using made up db for script to show functionality:
    # if email in db:
        print('An account already exists with that email')
        return
    # db[email] = new_usr = User(firstName, lastName, email, password, address)
    new_usr = User(firstName, lastName, email, password, address)
    db.execute('INSERT INTO usersExample (firstName, lastName, email, password, address) VALUES',
            (firstName, lastName, email, password, address,))
    db.commit()
    print('Registered user with email ' + email)
    return new_usr

###
# End of register 


# Login
#########
@app.route('/login', methods=['GET', 'POST'])
def login():
    db = get_db()
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
    return loginUser(email, password, db, [])

def loginUser(email, password, db, session):
    similar = db.execute('SELECT * FROM usersExample WHERE email = \'{email}\'').fetchall()
    if len(similar)==0:
    # using made up db for script to show functionality:
    # if email not in db:
        print('Wrong email or account does not exit.')
        return
    elif similar[0]['password']!=password:
    # elif db[email].getPassword()!=password:
        print('Incorrect password')
        return
    session.append(email)
    print('Successfully logged-in')
    return 


def logout(user, session):
    if user.getEmail() in session:
        session.remove(user.getEmail())
        return "Successfully logged-out"
    return 
# End of lognin


