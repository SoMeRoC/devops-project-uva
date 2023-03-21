IF OBJECT_ID('ChessGames', 'U') IS NOT NULL
BEGIN
  DROP TABLE ChessGames;
END;



CREATE TABLE ChessGames (
    id INT IDENTITY(1,1) PRIMARY KEY,
    start date,
    black varchar(255) NOT NULL,
    blackConId varchar(255) DEFAULT '',
    white varchar(255) NOT NULL,
    whiteConId varchar(255) DEFAULT ''
);