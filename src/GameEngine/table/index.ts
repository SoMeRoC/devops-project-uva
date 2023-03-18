import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const data = req.body;

    // const partitionKey = data.partitionKey;
    // const rowKey = data.rowKey;
    // const someData = data.someData;
    context.log( data.partitionKey);

    // const entity = {
    //     partitionKey: "hometasks",
    //     rowKey: "2",
    //     description: "Drink beer"
    // };

    try {
        context.bindings.tableBinding = [];
        context.log("1");

        context.bindings.tableBinding.push({
            "partitionKey": "hometasks",
            "rowKey": "2",
            "description": "Drink beer"}
        );

    } catch (err) {
        context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
    }
    // context.log("2:");

    // // context.log(context);

    const responseMessage = "Hello World";

    context.res = {
        // status defaults to 200
        body: responseMessage
    };
    // context.done
    // callback(null);
};

export default httpTrigger;
