import { Board, Piece, Color, Square } from "./board";

export enum Action {
	Resign,
	Timeout,
	Move,
}

export type Move = {
	type: Action,
	color: Color,
	pieceMove?: PieceMove,
};

type PieceMove = {
	from: Square,
	to: Square,
	promotion?: Piece,
};

const empty = {piece: Piece.Empty, color: Color.None};
const CARDS: Map<string, typeof Card> = new Map();

// This is a naive algorithm to find squares between two given squares,
// it works for bishop, rook, and kight-type moves but not much else
function rayBetween(from: Square, to: Square): Square[] {
	const curr = {...from};

	const ray = [];
	while (curr.row != to.row || curr.col != to.col) {
		curr.row += Math.sign(to.row - curr.row);
		curr.col += Math.sign(to.col - curr.col);

		ray.push({...curr});
	}

	ray.pop();
	return ray;
}

// Simple preset for common "compute" method, which moves a piece from its from
// square to its to square
function movePiece(board: Board, move: Move): void {
	const from = move.pieceMove!.from;
	const to = move.pieceMove!.to;

	board.grid[to.row][to.col] = board.grid[from.row][from.col];
	board.grid[from.row][from.col] = empty;
}

// Simple preset for common "applies" method, which checks if a piece being
// moved is the piece to which the card pertains
function isPiece(piece: Piece) {
	return (board: Board, move: Move) => {
		// If this is not a move of a piece, this card does not apply
		if (move.type != Action.Move || !move.pieceMove)
			return false;

		// This card applies if the piece being moved matches with the given
		// piece and the color of the piece matches with who is to move
		const from = move.pieceMove.from;
		return board.grid[from.row][from.col].piece == piece &&
			   board.grid[from.row][from.col].color == board.color;
	}
}

type CardSerialization = {
	color: Color,
	className: string,
};

export class Card {
	title = "Dummy card";
	description = "Dummy card";
	
	color = Color.None;

	constructor(color: Color = Color.None) {
		this.color = color;
	}

	static deserialize(obj: CardSerialization) {
		return new(CARDS.get(obj.className)!)(obj.color);
	}

	// Takes in a board state and a move that is made and then
	// determines whether this card applies in these circumstances
	applies(_board: Board, _move: Move): boolean {
		return true
	}

	// Returns true if it considers this move legal, false otherwise
	legal(_board: Board, _move: Move): boolean {
		return true
	}

	// Changes the state of the given "board" object according to the results
	// of this card on this move
	compute(_board: Board, _move: Move): void {}

	// Make this card saveable to WebJobsStorage in a semantic way
	serialize(): CardSerialization {
		return {
			color: this.color,
			className: this.constructor.name,
		};
	}
}

function card(constructor: typeof Card) {
	CARDS.set(constructor.name, constructor);
}

@card
export class MoveInBounds extends Card {
	title = "Move within bounds";
	description = "A piece cannot be moved outside the chess board";

	legal(_board: Board, move: Move) {
		return move.pieceMove == undefined ||
			   move.pieceMove.to.row >= 0 &&
			   move.pieceMove.to.row <= 8 &&
			   move.pieceMove.to.col >= 0 &&
			   move.pieceMove.to.col <= 8;
	}
}

@card
export class Bishop extends Card {
	title = "Bishops";
	description = "Bishops move according to chess rules";

	applies = isPiece(Piece.Bishop);
	compute = movePiece;

	legal(board: Board, move: Move) {
		const from = move.pieceMove!.from;
		const to = move.pieceMove!.to;

		// Check if the piece moved at all
		if (from.col == to.col && from.row == to.row)
			return false;

		// Check if the move is actually according to bishop rules
		if (Math.abs(from.row - to.row) != Math.abs(from.col - to.col))
			return false;

		// Check if there are no pieces in the way
		for (const square of rayBetween(from, to)) {
			if (board.grid[square.row][square.col].piece != Piece.Empty)
				return false;
		}

		return true;
	}
}

@card
export class Rook extends Card {
	title = "Rooks";
	description = "Rooks move according to chess rules";

	applies = isPiece(Piece.Rook);
	compute = movePiece;

	legal(board: Board, move: Move) {
		const from = move.pieceMove!.from;
		const to = move.pieceMove!.to;

		// Check if the piece moved at all
		if (from.col == to.col && from.row == to.row)
			return false;

		// Check if the move complies by rook rules
		if (from.col != to.col && from.row != to.row)
			return false;

		// Check if there are no pieces in the way
		for (const square of rayBetween(from, to)) {
			if (board.grid[square.row][square.col].piece != Piece.Empty)
				return false;
		}

		return true;
	}
}

@card
export class Knight extends Card {
	title = "Knights";
	description = "Knights move according to chess rules";

	applies = isPiece(Piece.Knight);
	compute = movePiece;

	legal(_board: Board, move: Move) {
		const from = move.pieceMove!.from;
		const to = move.pieceMove!.to;
		const diff = {
			row: Math.abs(to.row - from.row),
			col: Math.abs(to.col - from.col)
		};

		return [1, 2].includes(diff.row) &&
			   [1, 2].includes(diff.col) &&
			   diff.col != diff.row;
	}
}

@card
export class Queen extends Card {
	title = "Queens";
	description = "Queens move according to chess rules";
	applies = isPiece(Piece.Queen);
	compute = movePiece;

	legal(board: Board, move: Move) {
		return (new Bishop).legal(board, move) || (new Rook).legal(board, move);
	}
}

@card
export class Pawn extends Card {
	title = "Pawns";
	description = "Pawns move according to chess rules";

	applies = isPiece(Piece.Pawn);
	compute = movePiece;

	legal(board: Board, move: Move) {
		const from = move.pieceMove!.from;
		const to = move.pieceMove!.to;

		// Make sure that the pawn is moving forwards
		if (board.color == Color.Black && from.row >= to.row)
			return false;

		if (board.color == Color.White && from.row <= to.row)
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
			board.grid[to.row][to.col].piece == Piece.Empty &&
			rayBetween(from, to).every(
				e => board.grid[e.row][e.col].piece == Piece.Empty)) {
			return true;
		}

		// If the pawn moves one square forward, there must not be a piece there
		else if (diff.row == 1 &&
				 diff.col == 0 &&
				 board.grid[to.row][to.col].piece == Piece.Empty) {
			return true;
		}

		// If the pawn moves one square diagonally, there must be an enemy
		// piece OR there must be an en passant square there, in which case the
		// pawn also must not be on row 4 or 5 
		else if (diff.row == 1 && diff.col == 1) {
			if ((from.row == 3 || from.row == 4) &&
				board.enPassants.some(e => e.row == to.row && e.col == to.col))
				return true;

			if (board.grid[to.row][to.col].piece != Piece.Empty &&
				board.grid[to.row][to.col].color != board.color)
				return true;
		}

		return false;
	}
}

@card
export class King extends Card {
	title = "Kings";
	description = "Kings move according to chess rules";

	applies(board: Board, move: Move) {
		const to = move.pieceMove!.to;
		const from = move.pieceMove!.from;

		// This card only applies to king moves that are not also castling
		// moves, so the column shift must be 0 or 1 (any more would be
		// a castling move)
		return isPiece(Piece.King)(board, move) &&
			   Math.abs(to.col - from.col) <= 1;
	}

	compute = movePiece;

	legal(_board: Board, move: Move) {
		const to = move.pieceMove!.to;
		const from = move.pieceMove!.from;
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
}

@card
export class WinCondition extends Card {
	title = "Win condition";
	description = "A player who has no king on the board loses";

	compute(board: Board, _move: Move) {
		const kings = board.grid.flat().filter(e => e.piece == Piece.King);
		const whiteKings = kings.filter(e => e.color == Color.White);
		const blackKings = kings.filter(e => e.color == Color.Black);

		if (whiteKings.length == 0)
			board.win = Color.White;
		else if (blackKings.length == 0)
			board.win = Color.Black;
	}
}
