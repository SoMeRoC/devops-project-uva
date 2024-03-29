import React from 'react';

import Chessground from "./chessground";
import { Api as cgApi } from 'chessground/api';
import * as cg from 'chessground/types';
import {Alert, Modal, Card, CardGroup} from 'react-bootstrap/';

import "./full-page-background.scss"
import "./game.scss"

import GameAPI from "../api";

interface rule {
  className: string,
  title: string,
  color: "b"|"w"|" ",
  description: string
}
class Game extends React.Component<{ sessionId: string, apiToken: string }> {
  state: {
    color: "black" | "white" | undefined,
    white: number,  // Did this as nested interfaces first but was not desirable. See: https://stackoverflow.com/a/51136076
    black: number,
    alertText: string,
    showProposedRules: boolean,
    proposedRules: rule[],
    activeRules: rule[],
    waitingOnNextRound: boolean
  }
  api: GameAPI
  cgApi: undefined | cgApi

  constructor(props:any) {
    super(props);

    this.api = new GameAPI(props.sessionId, props.apiToken);
    this.state = {
      color: undefined,
      white: 0,
      black: 0,
      alertText: "",
      showProposedRules: false,
      proposedRules: [],
      activeRules: [],
      waitingOnNextRound: false,
    };
  }

  receiveCGApi = (cgApi: cgApi): void => {
    this.cgApi = cgApi;

    this.api.on('handshake', (color: "b"|"w", board) => {
      const cgColor = this.getCgColor(color);
      this.setState({ color: cgColor });

      const {boardstate, score, rules, cardSelection} = board;
      this.cgApi?.set({
        orientation: cgColor,
        movable: {
          free: true
        },
        fen: boardstate.fen,
      });

      this.setState({
        black: score.black,
        white: score.white,
        activeRules: rules,
        proposedRules: cardSelection,
      });
    })
    this.api.on('newState', (newState) => {
      const {boardstate, score, rules, cardSelection} = newState;

      this.cgApi?.set({
        fen: boardstate.fen,
      })

      this.setState({
        black: score.black,
        white: score.white,
        activeRules: rules,
        proposedRules: cardSelection,
      });

      if (boardstate.won !== " ") {
        const winner = this.getCgColor(boardstate.won);
        if(score.black >= 5 || score.white >= 5) {
          this.setState({alertText: `${this.getCgColor(boardstate.won)} WON!`.toUpperCase()})
        } else {
          this.setState({alertText: `${winner} WON ROUND ${this.state.black + this.state.white + 1}!`.toUpperCase()})

          if (winner !== this.state.color)
            this.handleShow();
        }
      }
    });
    this.api.connect();
  }

  onPlayerMove = (from: cg.Key, to: cg.Key) => {
    //TODO: Send move to api, if valid -> change board, otherwise retry
    const move = `${from}-${to}`;
    this.api.action({action:2, move: move});
  }

  onRuleChoose = (ruleIndex: number) => {
    this.api.action({action: 3, choice: ruleIndex});
  }

  handleRuleClicked = (ruleIndex:number) => {this.onRuleChoose(ruleIndex)}
  handleClose = () => this.setState({showProposedRules: false});
  handleShow = () => this.setState({showProposedRules: true});

  render() {
    const chessConfig = {
      movable: {
        free: true,
        events: {
          after: this.onPlayerMove
        }
      },
    };

    return (
      <div className="full-background h-100 d-flex flex-column min-vh-100 justify-content-center align-items-center">
            <>
              <div style={{position:"absolute"}}>
                <div style={{position: "relative"}}>
                  <div>
                    <Chessground config={chessConfig} api={this.cgApi} setApi={this.receiveCGApi}/>
                  </div>
                  <div className="score-sidebar text-monospace font-weight-bold lh-1" style={{}}>
                    <div className="user-container">
                      <div className="username">
                        {/* {this.props.opponent.username} */}
                      </div>
                      <div className="score-number">
                        {this.state.color ? this.state[this.getOpponent()] : null}
                      </div>
                    </div>
                    <div className="user-container" style={{position: "absolute", bottom: "0px"}}>
                      <div className="score-number">
                        {this.state.color ? this.state[this.state.color] : null}
                      </div>
                      <div className="username">
                        {/* {this.props.player.username} */}
                      </div>
                    </div>
                  </div>
                  <div className="rule-sidebar">
                    {
                      this.state.activeRules.map((rule, i) => (
                        rule.color !== " " &&
                        <Card key={i} bg="light" text="dark" style={{ width: "18rem", marginBottom: "10px"}}>
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
                    this.state.proposedRules.map((rule, i) => (
                      <Card key={i} onClick={() => this.handleRuleClicked(i)} style={{ width: "18rem", cursor: "pointer"}}>
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
              {/* <button style={{position: "absolute", bottom: "10px"}} onClick={this.buttonClick}>Test button</button> */}
            </>

      </div>
    );
  }

  // ======================
  // Help functions
  // ======================

  private getOpponent = (): cg.Color => {
    if (this.state.color === "black")
      return "white";
    if (this.state.color === "white")
      return "black";
    throw new Error("Invalid orientation");
  }

  private getCgColor = (color: "b"|"w"): cg.Color => {
    if (color === "w")
      return "white";
    else
      return "black";
  }

  // Example programmatic move
  buttonClick = () => {
    console.log("clicked");

    // this.onRoundEnd({fen:"rnbqkbnr/pppppppp/11111111/11111111/11111111/11N11N11/PPPPPPPP/R1BQKB1R w - - 14 8","won":"b"}
    // ,{black:1,white:1},
    // [{"color":" ", "className":"MoveInBounds", "title":"Move within bounds","description":"A piece cannot be moved outside the chess board"},
    // {"color":" ","className":"Bishop","title":"Bishops","description":"Bishops move according to chess rules"},
    // {"color":" ","className":"Rook","title":"Rooks","description":"Rooks move according to chess rules"},
    // {"color":" ","className":"Knight","title":"Knights","description":"Knights move according to chess rules"},
    // {"color":" ","className":"Queen","title":"Queens","description":"Queens move according to chess rules"},
    // {"color":" ","className":"Pawn","title":"Pawns","description":"Pawns move according to chess rules"},
    // {"color":" ","className":"King","title":"Kings","description":"Kings move according to chess rules"},
    // {"color":" ","className":"WinCondition","title":"Win condition","description":"A player who has no king on the board loses"}],
    // [{"color":"b", "className":"MoveInBounds", "title":"Move within bounds","description":"A piece cannot be moved outside the chess board"},
    // {"color":"w","className":"Bishop","title":"Bishops","description":"Bishops move according to chess rules"},
    // {"color":"b","className":"Rook","title":"Rooks","description":"Rooks move according to chess rules"}])
  }
}

export default Game;
