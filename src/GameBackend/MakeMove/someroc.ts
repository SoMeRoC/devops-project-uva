import * as Cards from "./cards.ts";

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

export enum Action {
	Resign,
	Timeout,
	Move,
}

export type ColoredPiece = {
	piece: Piece,
	color: Color,
};

export type Square = {
	row: number,
	col: number,
};

export type Move = {
	type: Action,
	color: Color,
	pieceMove?: PieceMove,
};

export type PieceMove = {
	from: Square,
	to: Square,
	promotion?: Piece,
};

export type FEN = string;

export abstract class Card {
	static description = "Dummy card";

	// Takes in a board state and a move that is made and then
	// determines whether this card applies in these circumstances
	static applies(_board: Board, _move: Move): boolean {
		return true
	}

	// Returns true if it considers this move legal, false otherwise
	static legal(_board: Board, _move: Move): boolean {
		return true
	}

	// Changes the state of the given "board" object according to the results
	// of this card on this move
	static compute(_board: Board, _move: Move): void {}
}

export class Board {
	cards: Card[];
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
 		this.cards = [Cards.MoveInBounds, Cards.Bishop];
	}

	pieceAt(square: Square): ColoredPiece {
		return this.grid[square.col][square.row];
	}

	eval(move: Move): Board {
		const prior = this.clone();

		for (const card of this.cards) {
			if (!card.applies(this, move)) continue;
			if (!card.legal(this, move)) return prior;

			card.compute(this, move);
		}

		return this;
	}

	clone(): Board {
		const clone = new Board();

		clone.cards = this.cards;
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
