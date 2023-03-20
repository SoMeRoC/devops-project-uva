import React from 'react';

import Chessground from "./chessground";
import { Api as cgApi } from 'chessground/api';
import * as cg from 'chessground/types';
import * as fen from 'chessground/fen';
import {Alert, Modal, Card, CardGroup} from 'react-bootstrap/';

import "./full-page-background.scss"
import "./game.scss"

type Winner = "black" | "white" | undefined;

interface user {
  id: string
  username: string
}

type props = { 
  gameId: string,
  orientation: "black" | "white",
  player: user,
  opponent: user
};
type state = { 
  cgApi: cgApi | null,
  white: number,  // Did this as nested interfaces first but was not desirable. See: https://stackoverflow.com/a/51136076
  black: number,
  alertText: string,
  showRules: boolean,
  rules: {title: string, text: string}[]
};
class Game extends React.Component<props, state> {

  constructor(props:any) {
    super(props);

    this.state = {
      cgApi: null, 
      white: 0,
      black: 0,
      alertText: "", 
      showRules: false,
      rules: [{title:"Test rule", text:"This rule doesn't do anything"}, {title:"Test rule", text:"This rule doesn't do anything"}]
    };

    // This binding is necessary to make `this` work in the callback
    this.buttonClick = this.buttonClick.bind(this);
    this.onPlayerMove = this.onPlayerMove.bind(this);
    this.onGameEnd = this.onGameEnd.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }

  private getOpponent(): cg.Color {
    if (this.props.orientation === "black")
      return "white";
    if (this.props.orientation === "white")
      return "black";
    throw new Error("Invalid orientation");
  }

  // Example programmatic move
  buttonClick() {
    // this.state.cgApi?.move("a1", "a5");
    console.log("clicked");
    // this.onGameEnd("white");
    this.onOpponentMove("a5", "a6");
    this.onRoundEnd("black");
  }

  onOpponentMove(from: cg.Key, to: cg.Key) {
    // Programmatically move opponent pieces
    this.state.cgApi?.move(from, to);

    // Make it so the pieces are moveable again
    this.state.cgApi?.set({
      turnColor: this.props.orientation,
      movable: {
        color: this.props.orientation  
        // dests: getPossibleDestinations(), //TODO: add all possible destinations for current board
        // free: false, //TODO: remove free move when all destinations are added
      } 
    });
  }

  onRoundEnd(winner: Winner) {
    if (winner !== undefined) {
      // Update the score
      this.setState({...this.state, [winner]:  this.state[winner] + 1});
      this.setState({alertText: `${winner} WON ROUND ${this.state.black + this.state.white + 1}!`.toUpperCase() })

      if (winner !== this.props.orientation) {
        // TODO: retrieve rules from backend 
        this.handleShow();
      }
    } else {
      this.setState({alertText: "A TIE!"})
    }
  }

  onRoundStart(initialFen: cg.FEN = fen.initial) {
    // TODO: load in board state from backend
    this.state.cgApi?.set({
      fen: initialFen,
    })
  }

  onGameEnd(winner: Winner) {
    // Set board still
    this.state.cgApi?.set({
      selectable: {
        enabled: false,
      },
      draggable: {
        enabled: false,
      }
    });

    this.setState({alertText: `${winner} WON!`.toUpperCase()})
  }

  onPlayerMove(from: cg.Key, to: cg.Key) {
    const opponent = this.getOpponent() 
    this.state.cgApi?.set({
      turnColor: opponent,
      movable: {
        color: undefined,
        // dests: getPossibleDestinations(), //TODO: add all possible destinations for current board
        // free: false, //TODO: remove free move when all destinations are added
      }
    });
    
    // TODO: send move to API and wait for result to see if it was valid
  }

  getPossibleDestinations() {

  }

  handleRuleClicked = (rule:any) => {console.log(rule); this.handleClose(); /*TODO: send rule choice to backend */}
  handleClose = () => this.setState({showRules: false});
  handleShow = () => this.setState({showRules: true});

  render() {
    const chessConfig = {
      animation: {
        enabled: true,
        duration: 1000
      },
      orientation: this.props?.orientation,
      turnColor: this.props?.orientation,
      movable: {
        // free: false, //TODO: necessary
        color: "white" as cg.Color,
        // dests: getPossibleDestinations(), //TODO: 
        events: {
          after: this.onPlayerMove
        }
      }
    };

    return (
      <div className="full-background h-100 d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <div style={{position:"absolute"}}>
          <div style={{position: "relative"}}>
            <div>
              <Chessground config={chessConfig} api={this.state.cgApi} setApi={(cgApi) => this.setState({cgApi:cgApi})}/>
            </div>
            <div className="score-sidebar text-monospace font-weight-bold lh-1" style={{}}>
              <div className="user-container">
                <div className="username">
                  {this.props.opponent.username}
                </div>
                <div className="score-number">
                  {this.state[this.getOpponent()]}
                </div>
              </div>
              <div className="user-container" style={{position: "absolute", bottom: "0px"}}>
                <div className="score-number">
                  {this.state[this.props.orientation]}
                </div>
                <div className="username">
                  {this.props.player.username}
                </div>
              </div>
            </div>
          </div>
          {/* Could be nicer to where it hides after x amount of seconds, but time shortages */}
          <Alert show={this.state.alertText !== ""} variant="primary"> {this.state.alertText} </Alert>
        </div>
        <Modal show={this.state.showRules} onHide={this.handleClose} animation={true} centered>
          <CardGroup>
            {
               this.state.rules.map((rule) => (
                <Card onClick={() => this.handleRuleClicked(rule)} style={{ width: "18rem", cursor: "pointer"}}>
                  <Card.Body>
                    <Card.Title>{rule.title}</Card.Title>
                    <Card.Text>{rule.text}</Card.Text>
                  </Card.Body>
                </Card>
              ))
            }
          </CardGroup>
        </Modal>
        {/* TODO: remove this button */}
        <button style={{position: "absolute", bottom: "10px"}} onClick={this.buttonClick}>Test button</button>
      </div>
    );
  }
}

export default Game;
