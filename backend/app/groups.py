
class Group:
    def __init__(self, groupID, name, activity):
        self.name = name
        self.groupID = groupID
        self.activity = activity
    
def search(db, name, lat, long, dist):
    if lat != 0 or long != 0:
        messages = db.execute("SELECT * FROM Groups WHERE group_name like ? and ((latitude IS NULL and longitude IS NULL) or true)", ["%" + name + "%"] ).fetchall()
        print( lat)
    else:
        messages = db.execute("SELECT * FROM Groups WHERE group_name like ?", ["%" + name + "%"] ).fetchall()
        print( name)
        
    return messages


