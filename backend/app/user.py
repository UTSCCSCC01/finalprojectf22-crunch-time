class User:
    def __init__(self, firstName, lastName, email, password, address):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password
        self.address = address 

    def getFirstName(self):
        return self.firstName

    def getLasttName(self):
        return self.lastName

    def getEmail(self):
        return self.email

    def getPassword(self):
        return self.password

    def getAddress(self):
        return self.address
    
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