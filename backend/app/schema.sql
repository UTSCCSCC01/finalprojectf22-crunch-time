DROP TABLE IF EXISTS Example;
DROP TABLE IF EXISTS Groups;
DROP TABLE IF EXISTS User_in_group;
DROP TABLE IF EXISTS loggedInUsers;
DROP TABLE IF EXISTS users;

CREATE TABLE Example (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contents TEXT NOT NULL
);

CREATE TABLE Groups (
  group_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  size INTEGER DEFAULT 1000, 
  group_name Text NOT NULL,
  latitude FLOAT DEFAULT NULL,
  longitude FLOAT DEFAULT NULL
  skill_level INTEGER CHECK (skill_level IN (0, 1, 2))
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
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  address TEXT NOT NULL
);

INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (1, "Ken", "Nim", "Ken@mail.com", "securepass", "user1");
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (2, "Phil", "Ivy", "phil@mail.com", "securepass", "user2");
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (3, "Jim", "Carrie", "jim@mail.com", "securepass", "user3");
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (4, "Ben", "Uncle", "ben@mail.com", "securepass", 'user4');
INSERT into users (user_id, firstName, lastName, email, password, address) VALUES (5, "Mike", "Flem", "mike@mail.com", "securepass", "user5");

INSERT into Groups (group_id, group_name, latitude, longitude) VALUES (1, "Best basketball", 45, -80);
INSERT into Groups (group_id, group_name, latitude, longitude) VALUES (2, "Noobie chess", 44, -80);
INSERT into Groups (group_id, group_name, latitude, longitude) VALUES (3, "Cycling maniacs", 43, -79);
INSERT into Groups (group_id, group_name, latitude, longitude) VALUES (4, "Soccer bros", 10, 45);
INSERT into Groups (group_id, group_name) VALUES (5, "CS:GO Pro team");

INSERT into User_in_group (user_id, group_id) VALUES (1, 1);
INSERT into User_in_group (user_id, group_id) VALUES (2, 2);
INSERT into User_in_group (user_id, group_id) VALUES (3, 3);
INSERT into User_in_group (user_id, group_id) VALUES (4, 4);
INSERT into User_in_group (user_id, group_id) VALUES (5, 5);