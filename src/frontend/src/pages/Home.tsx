import React from "react"
import Chessground from "@react-chess/chessground"
import { Chess } from "chess.js"

import "./home.scss"

class Home extends React.Component {

  render(): any {
    //TODO: Make it play a random game
    const chess = new Chess()
    const chessConfig = {
      animation: {
        duration: 1000
      },
      drawable: {
        visible: false
      }
    };

    return (
      <div className="background h-100 d-flex flex-column">
        <div className="header-background">
          <div className="container">
            <div className="row py-5">
              <div className="col">
                <main className="px-3 title-container">
                  <h1 className="font-weight-bold" >SoMeRoC</h1>
                  <p className="lead">A roguelike chess game</p>
                  <p className="lead">
                    <a href="/game/" className="btn btn-light btn-lg btn-outline-dark play-button">Play now!</a>
                  </p>
                </main>
              </div>
              <div className="col">
                <Chessground width={500} height={500} config={chessConfig}/>
              </div>
            </div>
          </div>
        </div>
        <div className="content-container container flex-grow-1">
          <div className="content">
            <h2>Rules</h2>
          </div>
        </div>
      </div>
    );
   
  }
}

export default Home;
