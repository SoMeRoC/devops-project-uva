import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { TableServiceClient, TableClient } from "@azure/data-tables";
import { Game } from "./someroc";

const dbConnection = process.env.AzureWebJobsStorage;
const gameStateTable = "gameStates";

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
	let game;
	let entity;
	try {
		entity = await client.getEntity("games", gameid);
		game = JSON.parse(entity["game"]);
	} catch (e) {
		console.log("ERROR: " + e);
		game = new Game;
	}

	// Request the game state JSON from the game state table according to the
	// game id in the request header
    entity = {
        partitionKey: "games",
        rowKey: gameid,
		game: JSON.stringify(game),
        // description: "take out the trash",
        // dueDate: new Date(2015, 6, 20)
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

	// await client.deleteTable();
};

export default httpTrigger;
