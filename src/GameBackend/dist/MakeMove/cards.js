"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinCondition = exports.King = exports.Pawn = exports.Queen = exports.Knight = exports.Rook = exports.Bishop = exports.MoveInBounds = exports.MoveAPiece = exports.Card = exports.DEFAULT_CARDS = exports.CARDS = exports.Action = void 0;
const board_1 = require("./board");
var Action;
(function (Action) {
    Action[Action["Resign"] = 0] = "Resign";
    Action[Action["Timeout"] = 1] = "Timeout";
    Action[Action["Move"] = 2] = "Move";
    Action[Action["ChooseCard"] = 3] = "ChooseCard";
})(Action = exports.Action || (exports.Action = {}));
exports.CARDS = new Map();
exports.DEFAULT_CARDS = [];
const empty = { piece: board_1.Piece.Empty, color: board_1.Color.None };
// This is a naive algorithm to find squares between two given squares,
// it works for bishop, rook, and kight-type moves but not much else
function rayBetween(from, to) {
    const curr = Object.assign({}, from);
    const ray = [];
    while (curr.row != to.row || curr.col != to.col) {
        curr.row += Math.sign(to.row - curr.row);
        curr.col += Math.sign(to.col - curr.col);
        ray.push(Object.assign({}, curr));
    }
    ray.pop();
    return ray;
}
// Simple preset for common "compute" method, which moves a piece from its from
// square to its to square
function movePiece(board, move) {
    const from = move.pieceMove.from;
    const to = move.pieceMove.to;
    board.grid[to.row][to.col] = board.grid[from.row][from.col];
    board.grid[from.row][from.col] = empty;
}
// Simple preset for common "applies" method, which checks if a piece being
// moved is the piece to which the card pertains
function isPiece(piece) {
    return (board, move) => {
        // If this is not a move of a piece, this card does not apply
        if (move.type != Action.Move || !move.pieceMove) {
            return false;
        }
        // This card applies if the piece being moved matches with the given
        // piece and the color of the piece matches with who is to move
        const from = move.pieceMove.from;
        console.log(from);
        console.log(board.grid[from.row][from.col]);
        console.log(board.color);
        return board.pieceAt(from).piece == piece &&
            board.pieceAt(from).color == board.color;
    };
}
class Card {
    constructor(color = board_1.Color.None) {
        this.title = "Dummy card";
        this.description = "Dummy card";
        this.color = board_1.Color.None;
        this.color = color;
    }
    static deserialize(obj) {
        return new (exports.CARDS.get(obj.className))(obj.color);
    }
    // Takes in a board state and a move that is made and then
    // determines whether this card applies in these circumstances
    applies(_board, _move) {
        return true;
    }
    // Returns true if it considers this move legal, false otherwise
    legal(_board, _move) {
        return true;
    }
    // Changes the state of the given "board" object according to the results
    // of this card on this move
    compute(_board, _move) { }
    // Make this card saveable to WebJobsStorage in a semantic way
    serialize() {
        return {
            color: this.color,
            className: this.constructor.name,
            title: this.title,
            description: this.description,
        };
    }
}
exports.Card = Card;
function card(constructor) {
    exports.CARDS.set(constructor.name, constructor);
}
function defaultCard(constructor) {
    card(constructor);
    exports.DEFAULT_CARDS.push(constructor);
}
let MoveAPiece = class MoveAPiece extends Card {
    constructor() {
        super(...arguments);
        this.title = "Move a piece";
        this.description = "Every move must actually be moving a piece";
    }
    applies(_board, move) {
        return move.type == Action.Move && move.pieceMove != undefined;
    }
    legal(board, move) {
        return board.pieceAt(move.pieceMove.from).piece != board_1.Piece.Empty;
    }
};
MoveAPiece = __decorate([
    defaultCard
], MoveAPiece);
exports.MoveAPiece = MoveAPiece;
let MoveInBounds = class MoveInBounds extends Card {
    constructor() {
        super(...arguments);
        this.title = "Move within bounds";
        this.description = "A piece cannot be moved outside the chess board";
    }
    legal(_board, move) {
        console.log(move);
        return move.pieceMove == undefined || (move.pieceMove.to.row >= 0 &&
            move.pieceMove.to.row < 8 &&
            move.pieceMove.to.col >= 0 &&
            move.pieceMove.to.col < 8);
    }
};
MoveInBounds = __decorate([
    defaultCard
], MoveInBounds);
exports.MoveInBounds = MoveInBounds;
let Bishop = class Bishop extends Card {
    constructor() {
        super(...arguments);
        this.title = "Bishops";
        this.description = "Bishops move according to chess rules";
        this.applies = isPiece(board_1.Piece.Bishop);
        this.compute = movePiece;
    }
    legal(board, move) {
        const from = move.pieceMove.from;
        const to = move.pieceMove.to;
        // Check if the piece moved at all
        if (from.col == to.col && from.row == to.row)
            return false;
        // Check if the move is actually according to bishop rules
        if (Math.abs(from.row - to.row) != Math.abs(from.col - to.col))
            return false;
        // Check if there are no pieces in the way
        for (const square of rayBetween(from, to)) {
            if (board.pieceAt(square).piece != board_1.Piece.Empty)
                return false;
        }
        return true;
    }
};
Bishop = __decorate([
    defaultCard
], Bishop);
exports.Bishop = Bishop;
let Rook = class Rook extends Card {
    constructor() {
        super(...arguments);
        this.title = "Rooks";
        this.description = "Rooks move according to chess rules";
        this.applies = isPiece(board_1.Piece.Rook);
        this.compute = movePiece;
    }
    legal(board, move) {
        const from = move.pieceMove.from;
        const to = move.pieceMove.to;
        // Check if the piece moved at all
        if (from.col == to.col && from.row == to.row)
            return false;
        // Check if the move complies by rook rules
        if (from.col != to.col && from.row != to.row)
            return false;
        // Check if there are no pieces in the way
        for (const square of rayBetween(from, to)) {
            if (board.pieceAt(square).piece != board_1.Piece.Empty)
                return false;
        }
        return true;
    }
};
Rook = __decorate([
    defaultCard
], Rook);
exports.Rook = Rook;
let Knight = class Knight extends Card {
    constructor() {
        super(...arguments);
        this.title = "Knights";
        this.description = "Knights move according to chess rules";
        this.applies = isPiece(board_1.Piece.Knight);
        this.compute = movePiece;
    }
    legal(_board, move) {
        const from = move.pieceMove.from;
        const to = move.pieceMove.to;
        const diff = {
            row: Math.abs(to.row - from.row),
            col: Math.abs(to.col - from.col)
        };
        return [1, 2].includes(diff.row) &&
            [1, 2].includes(diff.col) &&
            diff.col != diff.row;
    }
};
Knight = __decorate([
    defaultCard
], Knight);
exports.Knight = Knight;
let Queen = class Queen extends Card {
    constructor() {
        super(...arguments);
        this.title = "Queens";
        this.description = "Queens move according to chess rules";
        this.applies = isPiece(board_1.Piece.Queen);
        this.compute = movePiece;
    }
    legal(board, move) {
        return (new Bishop).legal(board, move) || (new Rook).legal(board, move);
    }
};
Queen = __decorate([
    defaultCard
], Queen);
exports.Queen = Queen;
let Pawn = class Pawn extends Card {
    constructor() {
        super(...arguments);
        this.title = "Pawns";
        this.description = "Pawns move according to chess rules";
        this.applies = isPiece(board_1.Piece.Pawn);
        this.compute = movePiece;
    }
    legal(board, move) {
        const from = move.pieceMove.from;
        const to = move.pieceMove.to;
        // Make sure that the pawn is moving forwards
        if (board.color == board_1.Color.Black && from.row >= to.row)
            return false;
        if (board.color == board_1.Color.White && from.row <= to.row)
            return false;
        const diff = {
            row: Math.abs(to.row - from.row),
            col: Math.abs(to.col - from.col)
        };
        // The pawn can only move two squares forward if it stays in the same
        // column and starts on row 2 or 7, in this case it must also not
        // encounter an intermediate piece or piece at the destination
        if (diff.row == 2 &&
            (from.row == 6 || from.row == 1) &&
            diff.col == 0 &&
            board.pieceAt(to).piece == board_1.Piece.Empty &&
            rayBetween(from, to).every(e => board.pieceAt(e).piece == board_1.Piece.Empty)) {
            return true;
        }
        // If the pawn moves one square forward, there must not be a piece there
        else if (diff.row == 1 &&
            diff.col == 0 &&
            board.pieceAt(to).piece == board_1.Piece.Empty) {
            return true;
        }
        // If the pawn moves one square diagonally, there must be an enemy
        // piece OR there must be an en passant square there, in which case the
        // pawn also must not be on row 4 or 5 
        else if (diff.row == 1 && diff.col == 1) {
            if (board.enPassant &&
                (from.row == 3 || from.row == 4) &&
                (from.col == board.enPassant.col - 1 ||
                    from.col == board.enPassant.col + 1) &&
                board.enPassant.row == to.row &&
                board.enPassant.col == to.col)
                return true;
            if (board.pieceAt(to).piece != board_1.Piece.Empty &&
                board.pieceAt(to).color != board.color)
                return true;
        }
        return false;
    }
};
Pawn = __decorate([
    defaultCard
], Pawn);
exports.Pawn = Pawn;
let King = class King extends Card {
    constructor() {
        super(...arguments);
        this.title = "Kings";
        this.description = "Kings move according to chess rules";
        this.compute = movePiece;
    }
    applies(board, move) {
        const to = move.pieceMove.to;
        const from = move.pieceMove.from;
        // This card only applies to king moves that are not also castling
        // moves, so the column shift must be 0 or 1 (any more would be
        // a castling move)
        return isPiece(board_1.Piece.King)(board, move) &&
            Math.abs(to.col - from.col) <= 1;
    }
    legal(_board, move) {
        const to = move.pieceMove.to;
        const from = move.pieceMove.from;
        const diff = {
            row: Math.abs(to.row - from.row),
            col: Math.abs(to.col - from.col)
        };
        // Check if the piece moved at all
        if (from == to)
            return false;
        // If the king moves one square in any direction, it is
        // aways legal
        return diff.row <= 1 && diff.col <= 1;
    }
};
King = __decorate([
    defaultCard
], King);
exports.King = King;
let WinCondition = class WinCondition extends Card {
    constructor() {
        super(...arguments);
        this.title = "Win condition";
        this.description = "A player who has no king on the board loses";
    }
    compute(board, _move) {
        const kings = board.grid.flat().filter(e => e.piece == board_1.Piece.King);
        const whiteKings = kings.filter(e => e.color == board_1.Color.White);
        const blackKings = kings.filter(e => e.color == board_1.Color.Black);
        if (whiteKings.length == 0)
            board.win = board_1.Color.White;
        else if (blackKings.length == 0)
            board.win = board_1.Color.Black;
    }
};
WinCondition = __decorate([
    defaultCard
], WinCondition);
exports.WinCondition = WinCondition;
//# sourceMappingURL=cards.js.map