import React from 'react';

import Chessground from "./chessground";
import { Api as cgApi } from 'chessground/api';
import * as cg from 'chessground/types';

import "./full-page-background.scss"

type Winner = "b" | "w" | " ";

type props = { 
  orientation: "black" | "white",
  gameId: string,
};
type state = { 
  cgApi: cgApi | null
};
class Game extends React.Component<props, state> {

  constructor(props:any) {
    super(props);

    this.state = {cgApi: null};

    // This binding is necessary to make `this` work in the callback
    this.buttonClick = this.buttonClick.bind(this);
    this.clientMove = this.clientMove.bind(this);

  }

  private getOpponent(): cg.Color {
    if (this.props.orientation === "black")
      return "white";
    if (this.props.orientation === "white")
      return "black";
    throw new Error("Invalid orientation");
  }

  private toCgColor(color: "b" | "w"): cg.Color {
    return (color === "b" ? "black" : "white") as cg.Color
  }

  // Example programmatic move
  buttonClick() {
    this.state.cgApi?.move("a1", "a5");
  }

  onEnemyMove(from: cg.Key, to: cg.Key) {
    this.state.cgApi?.move(from, to);

    this.state.cgApi?.set({
      movable: {color: this.props.orientation } // Make it so the pieces are moveable again
    });
  }

  onRoundEnd() {

  }

  onRoundStart() {

  }

  onGameEnd(winner: Winner) {

  }

  clientMove(from: cg.Key, to: cg.Key) {
    // this.state.cgApi?.set({
      // movable: {color: this.getOpponent() } // Make it so the pieces aren't moveable when its the enemy's turns
    // });

    // TODO: send move 

  }

  

  render() {
    const chessConfig = {
      animation: {
        duration: 1000
      },
      drawable: {
        visible: false
      },
      orientation: this.props?.orientation,
      movable: {
        color: "white" as cg.Color
      },
      events: {
        move: this.clientMove
      }
    };

    return (
      <div className="full-background h-100 d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Chessground config={chessConfig} api={this.state.cgApi} setApi={(cgApi) => this.setState({cgApi:cgApi})}/>
        <button onClick={this.buttonClick}>Test button</button>
      </div>
    );
  }
}

export default Game;
