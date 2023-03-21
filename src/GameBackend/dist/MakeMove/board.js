"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.Square = exports.Piece = exports.Color = void 0;
var Color;
(function (Color) {
    Color["White"] = "w";
    Color["Black"] = "b";
    Color["None"] = " ";
})(Color = exports.Color || (exports.Color = {}));
var Piece;
(function (Piece) {
    Piece["Pawn"] = "p";
    Piece["Knight"] = "n";
    Piece["Bishop"] = "b";
    Piece["Rook"] = "r";
    Piece["Queen"] = "q";
    Piece["King"] = "k";
    Piece["Empty"] = " ";
})(Piece = exports.Piece || (exports.Piece = {}));
class Square {
    constructor() {
        this.row = 0;
        this.col = 0;
    }
    static serialize(square) {
        return String.fromCharCode(square.col + "a".charCodeAt(0) + 1)
            + (square.row + 1);
    }
    static deserialize(str) {
        return {
            col: str.charCodeAt(0) - "a".charCodeAt(0),
            row: Number(str[1]) - 1,
        };
    }
}
exports.Square = Square;
class Board {
    static parseFENposition(fen) {
        const grid = [[]];
        let row = 0;
        let col = 0;
        for (const c of fen) {
            if (c == "/") {
                row++;
                col = 0;
                grid[row] = [];
                continue;
            }
            if (c == "1") {
                grid[row][col] = {
                    color: Color.None,
                    piece: Piece.Empty,
                };
            }
            else if (c.toLowerCase() == c) {
                grid[row][col] = {
                    color: Color.Black,
                    piece: c,
                };
            }
            else {
                grid[row][col] = {
                    color: Color.White,
                    piece: c.toLowerCase(),
                };
            }
            col++;
        }
        return grid;
    }
    static fromFEN(fen) {
        const board = new Board();
        const [grid, color, _castling, enPassant, ply, _fullmove] = fen.split(" ");
        board.grid = Board.parseFENposition(grid);
        board.color = color;
        board.castling = [];
        if (enPassant == "-") {
            board.enPassant = null;
        }
        else {
            board.enPassant = Square.deserialize(enPassant);
        }
        board.ply = Number(ply);
        return board;
    }
    constructor() {
        this.win = Color.None;
        this.color = Color.White;
        this.ply = 0;
        this.castling = [
            { piece: Piece.King, color: Color.White },
            { piece: Piece.King, color: Color.Black },
            { piece: Piece.Queen, color: Color.White },
            { piece: Piece.Queen, color: Color.Black },
        ];
        this.color = Color.White;
        this.enPassant = null;
        this.grid = Board.parseFENposition("rnbqkbnr/pppppppp/11111111/11111111/11111111/11111111/PPPPPPPP/RNBQKBNR");
    }
    pieceAt(square) {
        return this.grid[square.row][square.col];
    }
    clone() {
        const clone = new Board();
        clone.color = this.color;
        clone.enPassant = this.enPassant;
        clone.grid = this.grid;
        return clone;
    }
    toFEN() {
        // Position encoded
        let fen = this.grid.reverse().map(row => row.map(e => {
            const { piece: piece, color: color } = e;
            if (piece == Piece.Empty) {
                return "1";
            }
            if (color == Color.White) {
                return piece.toUpperCase();
            }
            return piece;
        }).join("")).join("/");
        // Current color to move
        fen += " ";
        fen += this.color;
        // TODO: Castling rights (none for now)
        fen += " ";
        fen += "-";
        // En-passant square
        fen += " ";
        if (this.enPassant) {
            fen += Square.serialize(this.enPassant);
        }
        else {
            fen += "-";
        }
        // Fifty-move rule
        fen += " ";
        fen += this.ply;
        // Total number of moves
        fen += " ";
        fen += Math.floor(this.ply / 2) + 1;
        return fen;
    }
}
exports.Board = Board;
//# sourceMappingURL=board.js.map