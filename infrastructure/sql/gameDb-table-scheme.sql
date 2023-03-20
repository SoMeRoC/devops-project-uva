DROP TABLE IF EXISTS game_history;

CREATE TABLE game_history
(
    gameId INT IDENTITY PRIMARY KEY,
    gameState NVARCHAR(256) NOT NULL,
    wins  NVARCHAR(256)
)