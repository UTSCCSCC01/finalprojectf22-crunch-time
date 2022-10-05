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