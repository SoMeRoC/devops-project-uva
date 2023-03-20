"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_tables_1 = require("@azure/data-tables");
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        // const requestBody = req.body;
        // const data = JSON.parse(requestBody);
        // const partitionKey = data.partitionKey;
        // const rowKey = data.rowKey;
        // const someData = data.someData;
        const connectionString = process.env.AzureWebJobsStorage;
        context.log(connectionString);
        const tableName = "gameStates";
        const tableService = data_tables_1.TableServiceClient.fromConnectionString(connectionString);
        yield tableService.createTable(tableName);
        const tableClient = data_tables_1.TableClient.fromConnectionString(connectionString, tableName);
        const task = {
            partitionKey: "hometasks",
            rowKey: "1",
            description: "take out the trash",
            dueDate: new Date(2015, 6, 20)
        };
        let result = yield tableClient.createEntity(task);
        const partitionKey = "boards";
        const rowKey = "123";
        const columnToRetrieve = "board";
        const entity = yield tableClient.getEntity(partitionKey, rowKey);
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
        }
        else {
            context.res = {
                status: 404,
                body: `Not working inserted/updated successfully.`
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map