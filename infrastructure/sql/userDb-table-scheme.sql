DROP TABLE IF EXISTS user_friends;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_stats;

CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  admin BIT NOT NULL DEFAULT 0
);

CREATE TABLE user_stats (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  games_won INT NOT NULL DEFAULT 0,
  games_lost INT NOT NULL DEFAULT 0,
  games_played INT NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TODO: Does not work yet
CREATE TABLE user_friends (
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  PRIMARY KEY (user_id, friend_id),
  CONSTRAINT FK_user_friends_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT FK_user_friends_friend_id FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE CASCADE
);
