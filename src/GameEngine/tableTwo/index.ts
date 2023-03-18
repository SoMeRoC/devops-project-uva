import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {TableServiceClient, TableClient} from "@azure/data-tables";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    // const requestBody = req.body;
    // const data = JSON.parse(requestBody);

    // const partitionKey = data.partitionKey;
    // const rowKey = data.rowKey;
    // const someData = data.someData;

    console.log(process.env.AzureWebJobsStorage)
    console.log("1");
    const connectionString = process.env.AzureWebJobsStorage;
    const tableName = "mytable";
    console.log("2");
    const tableService = TableServiceClient.fromConnectionString(connectionString);
    console.log("2.1");
    await tableService.createTable(tableName);
    console.log("3");
    const tableClient = TableClient.fromConnectionString(connectionString, tableName)
    console.log("4");
    const task = {
        partitionKey: "hometasks",
        rowKey: "1",
        description: "take out the trash",
        dueDate: new Date(2015, 6, 20)
    };

    let result = await tableClient.createEntity(task);
    console.log("5");
    context.log(`result: ${result}`);

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
