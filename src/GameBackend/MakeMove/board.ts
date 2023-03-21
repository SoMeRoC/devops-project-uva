export enum Color {
	White = "w",
	Black = "b",
	None = " ",
}

export enum Piece {
	Pawn = "p",
	Knight = "n",
	Bishop = "b",
	Rook = "r",
	Queen = "q",
	King = "k",
	Empty = " ",
}

export type ColoredPiece = {
	piece: Piece,
	color: Color,
};

export class Square {
	row = 0;
	col = 0;

	static serialize(square: Square): string {
		return String.fromCharCode(square.col + "a".charCodeAt(1)) + square.row;
	}

	static deserialize(str: string): Square {
		return {
			col: str.charCodeAt(1) - "a".charCodeAt(1),
			row: Number(str[1]),
		};
	}
}

export type FEN = string;

export class Board {
	win = Color.None;
	color = Color.White;
	ply = 0;
	castling: ColoredPiece[];
	enPassant: Square | null;
	grid: ColoredPiece[][];

	static fromFEN(fen: FEN): Board {
		const board = new Board();

		const [grid, color, _castling, enPassant, _halfmove, ply] = fen.split(" ");
		board.grid = [[]]; // TODO: parse FEN

		let row = 0;
		let col = 0;
		for (const c of grid) {
			if (c == "/") {
				row++;
				col = 0;
				board.grid[row] = [];
				continue;
			}

			if (c == "1") {
				board.grid[row][col] = {
					color: Color.None,
					piece: Piece.Empty,
				}
			} else if (c.toLowerCase() == c) {
				board.grid[row][col] = {
					color: Color.Black,
					piece: c as Piece,
				};
			} else {
				board.grid[row][col] = {
					color: Color.White,
					piece: c.toLowerCase() as Piece,
				};
			}

			col++;
		}
		board.color = color as Color;
		board.castling = [];
		if (enPassant == "-") {
			board.enPassant = null;
		} else {
			board.enPassant = Square.deserialize(enPassant);
		}
		board.ply = Number(ply);

		return board;
	}

	constructor() {
		this.castling = [
			{piece: Piece.King, color: Color.White},
			{piece: Piece.King, color: Color.Black},
			{piece: Piece.Queen, color: Color.White},
			{piece: Piece.Queen, color: Color.Black},
		];
		this.color = Color.White;
		this.enPassant = null;
		this.grid = [];
		for (let row = 0; row < 8; row++) {
			this.grid[row] = []

			for (let col = 0; col < 8; col++) {
				this.grid[row][col] = {piece: Piece.Empty, color: Color.None};
			}
		}
	}

	pieceAt(square: Square): ColoredPiece {
		return this.grid[square.col][square.row];
	}

	clone(): Board {
		const clone = new Board();

		clone.color = this.color;
		clone.enPassant = this.enPassant;
		clone.grid = this.grid;

		return clone;
	}

	toFEN(): FEN {
		// Position encoded
		let fen = this.grid.map(row => 
			row.map(e => {
				const {piece: piece, color: color} = e;

				if (piece == Piece.Empty) {
					return "1";
				}

				if (color == Color.White) {
					return piece.toUpperCase();
				}

				return piece;
			}).join("")
	   	).join("/");

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
		} else {
			fen += "-";
		}

		// Fifty-move rule
		fen += " ";
		fen += "0";
		
		// Total number of moves
		fen += " "
		// fen += Math.floor(this.ply / 2) + 1;
		fen += this.ply;

		return fen;
	}
}
