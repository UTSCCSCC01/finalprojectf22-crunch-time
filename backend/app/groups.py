class Group:
    def __init__(self, groupID, name, activity):
        self.name = name
        self.groupID = groupID
        self.activity = activity
    
    def search(self, groups, activity):
        for group in groups:
            if group.activity == activity:
                return group
