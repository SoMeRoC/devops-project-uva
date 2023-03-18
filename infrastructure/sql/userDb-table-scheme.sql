DECLARE @fk_name VARCHAR(255)
SELECT @fk_name = f.name FROM sys.foreign_keys AS f WHERE name LIKE 'FK__user_stat__use%'
IF @fk_name IS NOT NULL
BEGIN
    EXEC('ALTER TABLE dbo.user_stats DROP CONSTRAINT ' + @fk_name)
    DROP TABLE user_stats;
END

IF OBJECT_ID('users', 'U') IS NOT NULL
BEGIN
  DROP TABLE users;
END;


CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
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
