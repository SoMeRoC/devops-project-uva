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
const someroc_1 = require("./someroc");
const cards_1 = require("./cards");
const board_1 = require("./board");
const dbConnection = process.env.AzureWebJobsStorage;
const gameStateTable = "gameStates";
const partition = "games";
// Set up connection to Azure's table service
// const service = TableServiceClient.fromConnectionString(dbConnection);
const client = data_tables_1.TableClient.fromConnectionString(dbConnection, gameStateTable);
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        // Read mandatory query variables
        const gameid = req.query.gameid;
        const color = req.query.color;
        const action = Number(req.query.action);
        const choice = Number(req.query.choice);
        const serializedMove = req.query.move;
        if (gameid == undefined) {
            context.res = {
                status: 400,
                body: "GameID is a mandatory parameter",
            };
            return;
        }
        if (req.query.action == undefined) {
            context.res = {
                status: 400,
                body: "Action is a mandatory parameter",
            };
            return;
        }
        if (action == cards_1.Action.Move && serializedMove == undefined) {
            context.res = {
                status: 400,
                body: "For move action, move is required",
            };
            return;
        }
        if (action == cards_1.Action.Move && color == undefined) {
            context.res = {
                status: 400,
                body: "For move action, color is required",
            };
            return;
        }
        if (action == cards_1.Action.ChooseCard && choice == undefined) {
            context.res = {
                status: 400,
                body: "For choose action, color is required",
            };
            return;
        }
        // Make sure the table storing game states exists
        // await service.createTable("gameStates");
        yield client.createTable();
        // Load the game corresponding to the game id
        const game = new someroc_1.Game;
        try {
            const entity = yield client.getEntity(partition, gameid);
            game.wins = JSON.parse(entity["wins"]);
            game.cards = JSON.parse(entity["cards"]).map(e => cards_1.Card.deserialize(e));
            game.cardSelection = JSON.parse(entity["cardSelection"])
                .map(e => cards_1.Card.deserialize(e));
            game.board = board_1.Board.fromFEN(entity["fen"]);
        }
        catch (_e) {
            // Simply keep the game completely new if there is no entry for it
            // already
        }
        // Attempt to put the move on the board
        switch (action) {
            case cards_1.Action.Move:
                game.evalMove({
                    type: Number(action),
                    color: color,
                    pieceMove: {
                        from: board_1.Square.deserialize(serializedMove.split("-")[0]),
                        to: board_1.Square.deserialize(serializedMove.split("-")[1]),
                    },
                });
                break;
            case cards_1.Action.ChooseCard:
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
                    black: game.wins.filter(e => e == board_1.Color.Black).length,
                    white: game.wins.filter(e => e == board_1.Color.White).length,
                },
                rules: game.cards.map(e => e.serialize()),
                cardSelection: game.cardSelection.map(e => e.serialize()),
            }),
        };
        // Write the game back to the database
        yield client.upsertEntity({
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
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map