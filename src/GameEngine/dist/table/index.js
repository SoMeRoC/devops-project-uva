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
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        const data = req.body;
        // const partitionKey = data.partitionKey;
        // const rowKey = data.rowKey;
        // const someData = data.someData;
        context.log(data.partitionKey);
        // const entity = {
        //     partitionKey: "hometasks",
        //     rowKey: "2",
        //     description: "Drink beer"
        // };
        try {
            context.bindings.tableBinding = [];
            context.log("1");
            context.bindings.tableBinding.push({
                partitionKey: "hometasks",
                rowKey: "2",
                description: "Drink beer"
            });
        }
        catch (err) {
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
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map