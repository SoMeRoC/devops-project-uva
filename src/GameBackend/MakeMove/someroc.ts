import { Board, Color } from "./board";
import { Move, Card } from "./cards";
import * as Cards from "./cards";
import { CARDS, DEFAULT_CARDS } from "./cards";

export class Game {
	board: Board;
	cards: Card[];
	cardSelection: Card[];
	wins: Color[];

	constructor() {
		this.board = new Board;
		this.wins = [];
		this.cardSelection = [];
		this.cards = Array.from(DEFAULT_CARDS.map(c => new c(Color.None)));
		this.cards.map(e => e.serialize());
	}

	evalMove(move: Move) {
		if (this.board.win != Color.None)
			return;

		if (this.cardSelection.length > 0)
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
				return;
			}

			console.log("computed")
			card.compute(this.board, move);
		}

		this.board.ply++;
		
		// Switch color -- next person to move
		switch (this.board.color) {
			case Color.White:
				this.board.color = Color.Black;
				break;
			case Color.Black:
				this.board.color = Color.White
				break;
		}
			
		if (this.board.win != Color.None) {
			this.wins.push(this.board.win);
			this.offerCards();
		}
	}
	
	offerCards() {
		const options: typeof Card[] = Array.from(CARDS.values())
									   .filter(e => !DEFAULT_CARDS.includes(e));
		const shuffled = options.sort(() => 0.5 - Math.random());
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

		this.cardSelection = Array.from(selection.map(e => new e(loser)));
	}

	chooseCard(index: number) {
		this.cards.push(this.cardSelection[index]);
		this.cardSelection = [];
		this.board = new Board();
	}
}
