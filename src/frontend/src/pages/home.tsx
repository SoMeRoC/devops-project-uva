import React from "react"
import Chessground from "./chessground";
import { Navigate } from "react-router-dom";

import "./home.scss"

class Home extends React.Component<{}, {show: boolean, gameId?: number}> {
  constructor(props:any) {
    super(props);

    this.state = {
      show: false,
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.findMatch = this.findMatch.bind(this);
  }

  findMatch() {
    this.setState({gameId: 0})
    
    // this.handleShow();
    // TODO: fix endpoint
    // const endpoint: any = "";
    // fetch(endpoint)
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log(data);
    //   const id = 0;
    //   this.setState({gameId: 0, color: "white"})
    //   this.handleClose();
    // })
    // .catch((err) => {
    //   console.log(err.message);
    //   this.handleClose();
    // });
  }

  handleClose = () => this.setState({show: false});
  handleShow = () => this.setState({show: true});

  render(): any {
    const chessConfig = {
      animation: {
        duration: 1000
      },
      drawable: {
        visible: false
      },
      fen: "8/1QP1B3/pP5R/r1RnP3/5b2/2P4P/4K2k/5n2 w - - 0 1",
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
                    <a onClick={this.findMatch} className="btn btn-light btn-lg btn-outline-dark play-button">Play now!</a>
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
            <h1>Chess with more rules!</h1>
            <h2>The new game <b className="purple-text">no one</b> asked for.</h2>

            <h3 className="par">- <b className="purple-text">Always losing</b> at chess?</h3>
            <h3>- Opponents <b className="purple-text">baiting and outsmarting </b>you?</h3>
            <h3>- Would you rather blame <b className="purple-text">RNG</b> on your losses?</h3>

            <h2 className="par">Try now: <b className="purple-text">SoMeRoC</b>!</h2>
            <h2>Chess where you get <b className="purple-text">stronger by losing</b>!</h2>
          </div>
        </div>
        {this.state.gameId !== undefined && (
          <Navigate to={`/game/${this.state.gameId}`} replace={false}/>
        )}
      </div>
    );
  }
}

export default Home;
