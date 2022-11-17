from geopy.distance import geodesic
class Group:
    def __init__(self, groupID, name, activity):
        self.name = name
        self.groupID = groupID
        self.activity = activity
    
def search(db, name, lat, long, dist, activity_id):
    return db.execute("""SELECT * FROM Groups WHERE group_name like ? and ( (latitude IS NULL and longitude IS NULL)
     or (DIST(?, ?, latitude, longitude) <= ?)) AND (? = 0 OR activity_id = ?)""", 
     ["%" + name + "%", lat, long, dist, activity_id, activity_id]).fetchall()

def dist(lat, long, lat2, long2):
    return geodesic((lat, long), (lat2, long2)).km
