CREATE TABLE gameHistory
(
    gameId INT IDENTITY PRIMARY KEY,
    gameState NVARCHAR(256) NOT NULL,
    wins  NVARCHAR(256)
)