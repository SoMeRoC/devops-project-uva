import React from "react"
import Chessground from "./chessground";
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Navigate } from "react-router-dom";

import "./home.scss"

class Home extends React.Component<{}, {show: boolean, gameId?: number, color?: "white"|"black"}> {
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
    
    this.setState({gameId: 0, color: "white"})
    
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
            <h2>Rules</h2>
          </div>
        </div>
        <>
          <Modal
            show={this.state.show}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Looking for a match</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Please wait...
            </Modal.Body>
          </Modal>
          {this.state.gameId !== undefined && this.state.color !== undefined && (
            <Navigate to={`/game/${this.state.gameId}?color=${this.state.color}`} replace={false}/>
          )}
        </>
      </div>
    );
  }
}

export default Home;
