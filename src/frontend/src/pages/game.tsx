import React from 'react';

import Chessground from "./chessground";
import { Api as cgApi } from 'chessground/api';
import * as cg from 'chessground/types';
import {Alert, Modal, Card, CardGroup} from 'react-bootstrap/';
import {  } from "react-router";

import "./full-page-background.scss"
import "./game.scss"


interface user {
  id: string,
  username: string
}
interface rule {
  className: string,
  title: string,
  color: "b"|"w"|" ",
  description: string
}
interface score {
  black: number, 
  white: number
}
interface boardstate {
  fen: cg.FEN,
  won: "b"|"w"|" "
}

type state = { 
  color: "black" | "white",  
  cgApi: cgApi | null,
  white: number,  // Did this as nested interfaces first but was not desirable. See: https://stackoverflow.com/a/51136076
  black: number,
  alertText: string,
  showProposedRules: boolean,
  proposedRules: rule[]
  activeRules: rule[]
};
class Game extends React.Component<{}, state> {
  constructor(props:any) {
    super(props);

    // I have given up on react routing and have added a url search param
    // I apologize 😿
    const color = (new URLSearchParams(window.location.search)).get("color") as "black" | "white";

    this.state = {
      color: color,
      cgApi: null, 
      white: 0,
      black: 0,
      alertText: "", 
      showProposedRules: false,
      proposedRules: [],
      activeRules: [],
    };

    // This binding is necessary to make `this` work in the callback
    this.buttonClick = this.buttonClick.bind(this);
    this.onPlayerMove = this.onPlayerMove.bind(this);
    this.onGameEnd = this.onGameEnd.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.getCgColor = this.getCgColor.bind(this);
  }

  private getOpponent(): cg.Color {
    if (this.state.color === "black")
      return "white";
    if (this.state.color === "white")
      return "black";
    throw new Error("Invalid orientation");
  }

  private getCgColor(color: "b"|"w"): cg.Color {
    if (color === "w")
      return "white";
    else
      return "black";
  }

  
  // Example programmatic move
  buttonClick() {
    console.log("clicked");


    this.onOpponentMove({fen:"rnbqkbnr/pppppppp/11111111/11111111/11111111/11N11N11/PPPPPPPP/R1BQKB1R w - - 14 8","won":" "}
    ,{black:1,white:1},
    [{"color":" ", "className":"MoveInBounds", "title":"Move within bounds","description":"A piece cannot be moved outside the chess board"},
    {"color":" ","className":"Bishop","title":"Bishops","description":"Bishops move according to chess rules"},
    {"color":" ","className":"Rook","title":"Rooks","description":"Rooks move according to chess rules"},
    {"color":" ","className":"Knight","title":"Knights","description":"Knights move according to chess rules"},
    {"color":" ","className":"Queen","title":"Queens","description":"Queens move according to chess rules"},
    {"color":" ","className":"Pawn","title":"Pawns","description":"Pawns move according to chess rules"},
    {"color":" ","className":"King","title":"Kings","description":"Kings move according to chess rules"},
    {"color":" ","className":"WinCondition","title":"Win condition","description":"A player who has no king on the board loses"}])
  }


  onOpponentMove(boardstate: boardstate, score: score, activerules: rule[]) {
    this.state.cgApi?.set({
      fen: boardstate.fen, // Move all pieces to newly updated board
      turnColor: this.state.color, // Make it so the pieces are moveable again
      movable: {
        color: this.state.color // Make it so the pieces are moveable again
      },
      selectable: {
        enabled: true,
      },
      draggable: {
        enabled: true,
      },
    }); 

    this.setState({
      black: score.black, 
      white: score.white,
      activeRules: activerules
    });
  }


  onRoundEnd(boardstate: boardstate, score: score, activerules: rule[]) {
    if (boardstate.won === " ") 
      throw new Error ("Round ended without winner, this is not possible and should likely be onOpponentMove instead")

    // Update game state and don't allow movement
    this.state.cgApi?.set({
      fen: boardstate.fen,
      turnColor: undefined,
      movable: {
        color: undefined 
      },
      selectable: {
        enabled: false,
      },
      draggable: {
        enabled: false,
      },
    });

    // Update the score and display alert
    const winner = this.getCgColor(boardstate.won)  
    this.setState({
      black: score.black, 
      white: score.white,
      activeRules: activerules,
      alertText: `${winner} WON ROUND ${this.state.black + this.state.white + 1}!`.toUpperCase()
    });

    // TODO: retrieve rules if enemy won 
    if (winner !== this.state.color) {
      this.handleShow();
    }
  }


  onRoundStart(boardstate: boardstate, score: score, activerules: rule[]) {
    // Update score and active rules (score should already be correct but why not update again if we get the values 🤷‍♂️)
    this.setState({
      black: score.black, 
      white: score.white,
      activeRules: activerules,
    });

    this.state.cgApi?.set({
      fen: boardstate.fen,
      turnColor: "white",
      movable: {
        color: this.state.color === "white" ? "white" as cg.Color : undefined, // Can only play if they are white because white starts the game
      }
    })
  }


  onGameEnd(boardstate: boardstate, score: score, activerules: rule[]) {
    if (boardstate.won === " ") 
    throw new Error ("Game ended without winner, this is not possible and should likely be onOpponentMove instead")

    // Disable board
    this.state.cgApi?.set({fen: boardstate.fen});
    this.state.cgApi?.stop();

    // Update score for the last time
    this.setState({
      black: score.black, 
      white: score.white,
      activeRules: activerules,
      alertText: `${this.getCgColor(boardstate.won)} WON!`.toUpperCase()
    });
  }

  onPlayerMove(from: cg.Key, to: cg.Key) {
    //TODO: Send move to api, if valid -> change board, otherwise retry
    const move = `${from}-${to}`;
    const valid = true;

    if (valid) {
      // Give move to opponent, make player unable to move
      const opponent = this.getOpponent() 
      this.state.cgApi?.set({
        turnColor: opponent,
        selectable: {
          enabled: false,
        },
        draggable: {
          enabled: false,
        },

      });
    } else {
      this.setState({alertText: `INVALID MOVE ${move}!`});
      this.state.cgApi?.move(to, from)
    }
  }

  handleRuleClicked = (rule:any) => {console.log(rule); this.handleClose(); /*TODO: send rule choice to backend */}
  handleClose = () => this.setState({showProposedRules: false});
  handleShow = () => this.setState({showProposedRules: true});

  render() {
    const chessConfig = {
      animation: {
        enabled: true,
        duration: 1000
      },
      orientation: this.state.color,
      turnColor: "white" as cg.Color,
      movable: {
        color: this.state.color === "white" ? "white" as cg.Color : undefined, // Can only move pieces if they are white
        events: {
          after: this.onPlayerMove
        }
      },
    };

    //TODO: Show active cards
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
                  {/* {this.props.opponent.username} */}
                </div>
                <div className="score-number">
                  {this.state[this.getOpponent()]}
                </div>
              </div>
              <div className="user-container" style={{position: "absolute", bottom: "0px"}}>
                <div className="score-number">
                  {this.state[this.state.color]}
                </div>
                <div className="username">
                  {/* {this.props.player.username} */}
                </div>
              </div>
            </div>
            <div className="rule-sidebar">
              {
                this.state.activeRules.map((rule) => (
                  rule.color !== " " && 
                  <Card key={rule.className} bg="light" text="dark" style={{ width: "18rem", marginBottom: "10px"}}>
                    <Card.Body>
                      <Card.Title>{rule.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {this.getCgColor(rule.color)}
                      </Card.Subtitle>
                      <Card.Text>{rule.description}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              }
            </div>
          </div>
          {/* Could be nicer to where it hides after x amount of seconds, but time shortages */}
          <Alert show={this.state.alertText !== ""} variant="primary"> {this.state.alertText} </Alert>
        </div>
        <Modal show={this.state.showProposedRules} onHide={this.handleClose} animation={true} centered>
          <CardGroup>
            {
               this.state.proposedRules.map((rule) => (
                <Card key={rule.className} onClick={() => this.handleRuleClicked(rule)} style={{ width: "18rem", cursor: "pointer"}}>
                  <Card.Body>
                    <Card.Title>{rule.title}</Card.Title>
                    <Card.Text>{rule.description}</Card.Text>
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
