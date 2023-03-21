import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { TableServiceClient, TableClient } from "@azure/data-tables";
import { Game } from "./someroc";
import { Card, Move, Action } from "./cards";
import { Board, Square, Color } from "./board";

const dbConnection = process.env.AzureWebJobsStorage;
const gameStateTable = "gameStates";
const partition = "games";

// Set up connection to Azure's table service
// const service = TableServiceClient.fromConnectionString(dbConnection);
const client = TableClient.fromConnectionString(dbConnection, gameStateTable);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	// Read mandatory query variables
	const gameid = req.query.gameid;
	const color = req.query.color;
	const action = Number(req.query.action) as Action;
	const choice = Number(req.query.choice) as number;
	const serializedMove = req.query.move;

	context.log(gameid)
	context.log(color)
	context.log(action)
	context.log(serializedMove)

	// Make sure the table storing game states exists
    // await service.createTable("gameStates");
	await client.createTable();

	// Load the game corresponding to the game id
	const game = new Game;
	try {
		const entity = await client.getEntity<{
				wins: string
			}>(partition, gameid);

		game.wins = JSON.parse(entity["wins"]);
		game.cards = JSON.parse(entity["cards"]).map(e => Card.deserialize(e));
		game.cardSelection = JSON.parse(entity["cards"])
		                     .map(e => Card.deserialize(e));
		game.board = Board.fromFEN(entity["fen"]);
	} catch (_e) {
		// Simply keep the game completely new if there is no entry for it
		// already
	}

	// Get the move in IR
	let move: Move;
	if (serializedMove) {
		move = {
			type: Number(action) as Action,
			color: color as Color,
			pieceMove: {
				from: Square.deserialize(serializedMove.split("-")[0]),
				to: Square.deserialize(serializedMove.split("-")[1]),
			},
		};
	} else {
		move = {
			type: Number(action) as Action,
			color: color as Color,
		};
	}

	// Attempt to put the move on the board
	switch (action) {
		case Action.Move:
			game.evalMove(move);
			break;
		case Action.ChooseCard:
			game.chooseCard(choice);
			break;
	}

	// Get the result to the client
	context.res = {
		status: 200,
		body: JSON.stringify({
			boardstate: {
				fen: game.board.toFEN(),
				won: game.board.win,
			},
			score: {
				black: game.wins.filter(e => e == Color.Black).length,
				white: game.wins.filter(e => e == Color.White).length,
			},
			rules: game.cards.map(e => e.serialize()),
			cardSelection: game.cardSelection,
		}),
	};

	// Write the game back to the database
    await client.upsertEntity({
        partitionKey: partition,
        rowKey: gameid,

		// Round information
		fen: game.board.toFEN(),

		// Game information
		wins: JSON.stringify(game.wins),
		cards: JSON.stringify(game.cards.map(e => e.serialize())),
		cardSelection: JSON.stringify(game.cardSelection
									  .map(e => e.serialize())),
    });
};

export default httpTrigger;
