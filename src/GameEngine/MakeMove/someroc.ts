import { Board, Color } from "./board";
import { Move, Card } from "./cards";
import * as Cards from "./cards";
import { CARDS } from "./cards";

export class Game {
	board: Board;
	cards: Card[];
	cardSelection: Card[] = [];
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
		this.offerCards();
	}

	evalMove(move: Move) {
		if (this.board.win != Color.None)
			return;

		const prior = this.board.clone();

		for (const card of this.cards) {
			console.log(card.title);
			if (!card.applies(this.board, move)) {
				console.log("not applied")
				continue;
			}

			if (!card.legal(this.board, move)) {
				console.log("illegal")
				this.board = prior;
				break;
			}

			console.log("computed")
			card.compute(this.board, move);
		}

		this.board.ply++;

		if (this.board.win != Color.None)
			this.offerCards();
	}

	offerCards() {
		const options: typeof Card[] = Array.from(CARDS.values()).filter(
			e => !this.cards.map(e => e.constructor).includes(e)
		);
		const shuffled = Array.from(options).sort(() => 0.5 - Math.random());
		const selection = shuffled.slice(0, 3);
		let loser: Color;

		switch (this.board.win) {
			case Color.White:
				loser = Color.Black;
				break;
			case Color.Black:
				loser = Color.White
				break;
			default:
				loser = Color.None
		}

		return selection.map(e => new e(loser));
	}

	chooseCard(index: number) {
		this.cards.push(this.cardSelection[index]);
		this.cardSelection = [];
		this.board = new Board;
	}
}
