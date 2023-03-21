import { Board, Color } from "./board";
import { Move, Card } from "./cards";
import * as Cards from "./cards";

export class Game {
	board: Board;
	cards: Card[];
	wins: Color[];

	constructor() {
		this.board = new Board;
		this.wins = [Color.White, Color.Black];
		this.cards = [
			new Cards.MoveInBounds,
			new Cards.Bishop,
			new Cards.Rook,
			new Cards.Knight,
			new Cards.Queen,
			new Cards.Pawn,
			new Cards.King,
			new Cards.WinCondition,
		];
	}

	eval_move(move: Move) {
		const prior = this.board.clone();

		for (const card of this.cards) {
			if (!card.applies(this.board, move)) {
				continue;
			}

			if (!card.legal(this.board, move)) {
				this.board = prior;
				break;
			}

			card.compute(this.board, move);
		}

		this.board.ply++;
	}
}
