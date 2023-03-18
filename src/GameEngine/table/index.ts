import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const data = req.body;

    // const partitionKey = data.partitionKey;
    // const rowKey = data.rowKey;
    // const someData = data.someData;
    console.log( data.partitionKey)

    const entity = {
        partitionKey: "hometasks",
        rowKey: "1",
        description: "take out the trash"
    };

    context.bindings.outputTable = entity;

    context.res = {
        status: 200,
        body: `Data inserted/updated successfully.`
    };


    context.done();
};

export default httpTrigger;
