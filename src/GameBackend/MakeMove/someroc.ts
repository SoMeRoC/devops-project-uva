import { Board, Square, Piece, Color } from "./board";
import { Move } from "./cards";
import * as Cards from "./cards";


const CARDS = [
	Cards.MoveInBounds,
	Cards.Bishop,
	Cards.Rook,
	Cards.Knight,
	Cards.Queen,
	Cards.Pawn,
	Cards.King,
	Cards.WinCondition,
];

export class Game {
	board: Board;
	cards: number[];

	constructor() {
		this.board = new Board;
		this.cards = [0, 1, 2, 3, 4, 5, 6, 7];
	}

	eval_move(move: Move) {
		const prior = this.board.clone();

		for (const i of this.cards) {
			const card = CARDS[i];
			if (!card.applies(this.board, move)) continue;
			if (!card.legal(this.board, move)) return prior;

			card.compute(this.board, move);
		}
	}
}
