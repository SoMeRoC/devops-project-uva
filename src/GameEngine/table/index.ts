import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const data = req.body;

    // const partitionKey = data.partitionKey;
    // const rowKey = data.rowKey;
    // const someData = data.someData;
    context.log( data.partitionKey);

    const entity = {
        partitionKey: "hometasks",
        rowKey: "2",
        description: "Drink beer"
    };
    context.bindings.tableBinding = [];

    context.bindings.outputTable = entity;

    context.log("Context:");

    context.log(context);

    context.res = {
        status: 200,
        body: `Data inserted/updated successfully.`
    };


    context.done();
};

export default httpTrigger;
