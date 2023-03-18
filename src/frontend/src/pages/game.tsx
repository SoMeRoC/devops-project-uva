import React from 'react';

import Chessground from "./chessground";
import { Api as cgApi } from 'chessground/api';

import "./full-page-background.scss"

class Game extends React.Component<{}, {cgApi: cgApi | null}> {

  constructor(props:any) {
    super(props);

    this.state = {cgApi: null};

    // This binding is necessary to make `this` work in the callback
    this.buttonClick = this.buttonClick.bind(this);
  }

  // Example programmatic move
  buttonClick() {
    this.state.cgApi?.move("a1", "a5");
  }

  render() {
    const chessConfig = {
      animation: {
        duration: 1000
      },
      drawable: {
        visible: false
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
