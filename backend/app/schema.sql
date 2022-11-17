DROP TABLE IF EXISTS Example;
DROP TABLE IF EXISTS Groups;
DROP TABLE IF EXISTS User_in_group;
DROP TABLE IF EXISTS loggedInUsers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS Activities;
DROP TABLE IF EXISTS User_follows_activity;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS messages;

CREATE TABLE Example (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contents TEXT NOT NULL
);

CREATE TABLE Activities(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL
);

CREATE TABLE User_follows_activity (
  user_id INTEGER, 
  activity_id INTEGER NOT NULL,
  PRIMARY KEY(user_id, activity_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id), 
  FOREIGN KEY(activity_id) REFERENCES Activities(id)
);

CREATE TABLE Groups (
  group_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  activity_id INTEGER NOT NULL,
  activity_name TEXT NOT NULL,
  size INTEGER DEFAULT 1000, 
  group_name Text NOT NULL,
  latitude FLOAT DEFAULT NULL,
  longitude FLOAT DEFAULT NULL,
  skill_level INTEGER NOT NULL CHECK (skill_level IN (0, 1, 2)),
  group_creator INTEGER NOT NULL, 
  FOREIGN KEY(activity_id) REFERENCES Activities(id)
  FOREIGN KEY(group_creator) REFERENCES Users(user_id)
);

CREATE TABLE User_in_group (
  user_id INTEGER, 
  group_id INTEGER,
  PRIMARY KEY(user_id, group_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id), 
  FOREIGN KEY(group_id) REFERENCES Groups(group_id)
);

CREATE TABLE loggedInUsers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT NOT NULL 
);
  
CREATE TABLE Users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT  NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE Questions (
  firstName TEXT  NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  group_id INTEGER,
  user_name TEXT NOT NULL,
  time_stamp TEXT NOT NULL,
  context TEXT NOT NULL,
  FOREIGN KEY(user_id) REFERENCES Users(user_id),
  FOREIGN KEY(group_id) REFERENCES Groups(group_id)
);

INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (1, "Ken", "Nim", "Ken@mail.com", "securepass", "user1");
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (2, "Phil", "Ivy", "phil@mail.com", "securepass", "user2");
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (3, "Jim", "Carrie", "jim@mail.com", "securepass", "user3");
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (4, "Ben", "Uncle", "ben@mail.com", "securepass", 'user4');
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (5, "Mike", "Flem", "mike@mail.com", "securepass", "user5");

INSERT into Activities (name, type) VALUES ("Basketball", "Sport");
INSERT into Activities (name, type) VALUES ("Chess", "Board");
INSERT into Activities (name, type) VALUES ("Counter-Strike", "Digital");
INSERT into Activities (name, type) VALUES ("Soccer", "Sport");
INSERT into Activities (name, type) VALUES ("Smash Bros", "Digital");
INSERT into Activities (name, type) VALUES ("D&D", "Board");
INSERT into Activities (name, type) VALUES ("Pottery", "Crafts");
INSERT into Activities (name, type) VALUES ("Swimming", "Sport");
INSERT into Activities (name, type) VALUES ("Cycling", "Sport");


-- INSERT into Groups (group_id, activity_id, activity_name, group_name, latitude, longitude, skill_level) VALUES (1, 1, "Basketball", "Best basketball", 45, -80, 2);
-- INSERT into Groups (group_id, activity_id, activity_name, group_name, latitude, longitude, skill_level) VALUES (2, 2, "Chess", "Noobie chess", 44, -80, 0);
-- INSERT into Groups (group_id, activity_id, activity_name, group_name, latitude, longitude, skill_level) VALUES (3, 9, "Cycling", "Cycling maniacs", 43, -79, 1);
-- INSERT into Groups (group_id, activity_id, activity_name, group_name, latitude, longitude, skill_level) VALUES (4, 4, "Soccer", "Soccer bros", 10, 45, 1);
-- INSERT into Groups (group_id, activity_id, activity_name, group_name, skill_level) VALUES (5, 3, "Counter-Strike", "CS:GO Pro team", 2);

INSERT into User_in_group (user_id, group_id) VALUES (1, 1);
INSERT into User_in_group (user_id, group_id) VALUES (2, 2);
INSERT into User_in_group (user_id, group_id) VALUES (3, 3);
INSERT into User_in_group (user_id, group_id) VALUES (4, 4);
INSERT into User_in_group (user_id, group_id) VALUES (5, 5);