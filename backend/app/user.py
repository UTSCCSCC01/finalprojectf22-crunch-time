class User:
    def __init__(self, firstName, lastName, email, password, address):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password
        self.address = address 

    def getFirstName(self):
        return self.firstName

    def getLastName(self):
        return self.lastName

    def getEmail(self):
        return self.email

    def getPassword(self):
        return self.password

    def getAddress(self):
        return self.address

    def loginUser(email, password, db):
        similar = db.execute("SELECT * FROM users WHERE email = \'" + email+"\'").fetchall()
        if len(similar)==0:
            print('Wrong email or account does not exit.')
            return
        elif len(db.execute("SELECT * FROM users WHERE email = \'" + email+"\' AND password = \'" + password+"\'").fetchall())==0:
            print('Incorrect password')
            return
        print('Successfully logged-in')
        db.execute('INSERT INTO LoggedInUsers (user) VALUES (?)', (email,))
        firstName = (db.execute("SELECT firstName FROM users WHERE email = \'" + email+"\'").fetchall())[0][0]
        lastName = db.execute("SELECT lastName FROM users WHERE email = \'" + email+"\'").fetchall()[0][0]
        address = db.execute("SELECT address FROM users WHERE email = \'" + email+"\'").fetchall()[0][0]
        return User(firstName, lastName, email, password, address)

    def logoutUser(email, db):
        # loggedIn = db.execute("SELECT * FROM loggedInUsers WHERE user = \'" + email+"\'").fetchall()
        loggedIn = db.execute("SELECT * FROM loggedInUsers").fetchall()
        if len(loggedIn)==0:
            print("No user currently logged in")
            return
        db.execute("DELETE FROM loggedInUsers")
        print('Successfully logged-out')
        return 

    def registerUser(firstName, lastName, email, password, address, db):
        if len(password) < 8:
            print('Password must be at least 8 characters long')
            return
        similar = db.execute("SELECT * FROM users WHERE email = \'" + email+"\'").fetchall()
        if len(similar)!=0:
            print('An account already exists with that email')
            return 
        new_usr = User(firstName, lastName, email, password, address)
        db.execute('INSERT INTO users (firstName, lastName, email, password, address) VALUES(?,?,?,?,?)',
        (firstName, lastName, email, password, address))
        db.commit()
        print('Registered user with email ' + email)
        return new_usr
