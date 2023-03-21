"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const board_1 = require("./board");
const cards_1 = require("./cards");
class Game {
    constructor() {
        this.board = new board_1.Board;
        this.wins = [];
        this.cardSelection = [];
        this.cards = Array.from(cards_1.DEFAULT_CARDS.map(c => new c(board_1.Color.None)));
        this.cards.map(e => e.serialize());
    }
    evalMove(move) {
        if (this.board.win != board_1.Color.None)
            return;
        if (this.cardSelection.length > 0)
            return;
        const prior = this.board.clone();
        for (const card of this.cards) {
            console.log(card.title);
            if (!card.applies(this.board, move)) {
                console.log("not applied");
                continue;
            }
            if (!card.legal(this.board, move)) {
                console.log("illegal");
                this.board = prior;
                return;
            }
            console.log("computed");
            card.compute(this.board, move);
        }
        this.board.ply++;
        // Switch color -- next person to move
        switch (this.board.color) {
            case board_1.Color.White:
                this.board.color = board_1.Color.Black;
                break;
            case board_1.Color.Black:
                this.board.color = board_1.Color.White;
                break;
        }
        if (this.board.win != board_1.Color.None) {
            this.wins.push(this.board.win);
            this.offerCards();
        }
    }
    offerCards() {
        const options = Array.from(cards_1.CARDS.values())
            .filter(e => !cards_1.DEFAULT_CARDS.includes(e));
        const shuffled = options.sort(() => 0.5 - Math.random());
        const selection = shuffled.slice(0, 3);
        let loser;
        switch (this.board.win) {
            case board_1.Color.White:
                loser = board_1.Color.Black;
                break;
            case board_1.Color.Black:
                loser = board_1.Color.White;
                break;
            default:
                loser = board_1.Color.None;
        }
        this.cardSelection = selection.map(e => new e(loser));
    }
    chooseCard(index) {
        this.cards.push(this.cardSelection[index]);
        this.cardSelection = [];
        this.board = new board_1.Board();
    }
}
exports.Game = Game;
//# sourceMappingURL=someroc.js.map