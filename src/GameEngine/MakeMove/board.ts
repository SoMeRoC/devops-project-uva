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
		return String.fromCharCode(square.col + "a".charCodeAt(0) + 1)
		       + (square.row + 1);
	}

	static deserialize(str: string): Square {
		return {
			col: str.charCodeAt(0) - "a".charCodeAt(0),
			row: Number(str[1]) - 1,
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

	static parseFENposition(fen: string): ColoredPiece[][] {
		const grid: ColoredPiece[][] = [[]];
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
				}
			} else if (c.toLowerCase() == c) {
				grid[row][col] = {
					color: Color.Black,
					piece: c as Piece,
				};
			} else {
				grid[row][col] = {
					color: Color.White,
					piece: c.toLowerCase() as Piece,
				};
			}

			col++;
		}

		return grid;
	}

	static fromFEN(fen: FEN): Board {
		const board = new Board();

		const [grid, color, _castling, enPassant, ply, _fullmove] = fen.split(" ");
		board.grid = Board.parseFENposition(grid);
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
		this.grid = Board.parseFENposition("rnbqkbnr/pppppppp/11111111/11111111/11111111/11111111/PPPPPPPP/RNBQKBNR");
	}

	pieceAt(square: Square): ColoredPiece {
		return this.grid[square.row][square.col];
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
		let fen = this.grid.reverse().map(row => 
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
		fen += this.ply;

		// Total number of moves
		fen += " "
		fen += Math.floor(this.ply / 2) + 1;

		return fen;
	}
}
