import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {TableServiceClient, TableClient} from "@azure/data-tables";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // const requestBody = req.body;
    // const data = JSON.parse(requestBody);

    // const partitionKey = data.partitionKey;
    // const rowKey = data.rowKey;
    // const someData = data.someData;

    const connectionString = (process.env.AzureWebJobsStorage as string);
    context.log(connectionString);
    const tableName = "gameStates";
    const tableService = TableServiceClient.fromConnectionString(connectionString);
    await tableService.createTable(tableName);
    const tableClient = TableClient.fromConnectionString(connectionString, tableName)
    const task = {
        partitionKey: "hometasks",
        rowKey: "1",
        description: "take out the trash",
        dueDate: new Date(2015, 6, 20)
    };

    let result = await tableClient.createEntity(task);

    const partitionKey = "boards";
    const rowKey = "123";
    const columnToRetrieve = "board";

    const entity = await tableClient.getEntity(partitionKey, rowKey);
    const boardData = entity[columnToRetrieve];
    context.log("boardData");
    context.log(boardData);
    context.log("-----");

    if (result.etag) {
        context.log(`ETag: ${result.etag}`);

        context.res = {
            status: 200,
            body: `Data inserted/updated successfully.`
        };
    } else {
        context.res = {
            status: 404,
            body: `Not working inserted/updated successfully.`
        };
    }


};

export default httpTrigger;
