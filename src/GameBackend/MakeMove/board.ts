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

export type Square = {
	row: number,
	col: number,
};

export type FEN = string;

export class Board {
	castling: ColoredPiece[];
	win: Color = Color.None;
	color: Color = Color.White;
	enPassants: Square[];
	grid: ColoredPiece[][];

	static fromFEN(): Board {
		const board = new Board();

		board.grid = []; // TODO: parse FEN

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
		this.enPassants = [];
		this.grid = [[{piece: Piece.Pawn, color: Color.Black}]];
	}

	pieceAt(square: Square): ColoredPiece {
		return this.grid[square.col][square.row];
	}

	clone(): Board {
		const clone = new Board();

		clone.color = this.color;
		clone.enPassants = this.enPassants;
		clone.grid = this.grid;

		return clone;
	}

	toFEN(): FEN {
		// TODO
		return ""
	}
}
