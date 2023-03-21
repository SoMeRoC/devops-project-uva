import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { TableServiceClient, TableClient } from "@azure/data-tables";
import { Game } from "./someroc";
import { Card } from "./cards";
import { Color } from "./board";

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
	const move = req.query.move;

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
	} catch (_e) {
		// Simply keep the game completely new if there is no entry for it
		// already
	}

	// Write the game back to the database
    const entity = {
        partitionKey: partition,
        rowKey: gameid,

		// Round information
		// FEN: game.board.toFEN(),
		
		// Game information
		wins: JSON.stringify(game.wins),
		cards: JSON.stringify(game.cards.map(e => e.serialize())),
    };

    const result = await client.upsertEntity(entity);

    if (result.etag) {
        context.log(`ETag: ${result.etag}`);

        context.res = {
            status: 200,
            body: `Data inserted/updated successfully.`
        };
    } else {
        context.res = {
            status: 404,
            body: `Not working; inserted/updated unsuccessfully.`
        };
    }
};

export default httpTrigger;
