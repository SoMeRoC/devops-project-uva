import React from 'react';

import Chessground from "./chessground";
import { Api as cgApi } from 'chessground/api';
import * as cg from 'chessground/types';
import {Alert, Modal, Card, CardGroup, Spinner} from 'react-bootstrap/';

import "./full-page-background.scss"
import "./game.scss"

import GameAPI from "../api";
import BackendGampeApi from "./gameApi";

const sessionId = '2';
// const /* black */ apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly93cHMtc29tZXJvYy1kZXYud2VicHVic3ViLmF6dXJlLmNvbS9jbGllbnQvaHVicy9zZXNzaW9uX2h1YiIsImlhdCI6MTY3OTQ0MTM2NywiZXhwIjoxNjc5NDc3MzY3LCJzdWIiOiIyIn0.COB6zV4fDVrhFSPHmO9Kxv--OlKzr_6umVcidZ-thpU';
const /* white */ apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly93cHMtc29tZXJvYy1kZXYud2VicHVic3ViLmF6dXJlLmNvbS9jbGllbnQvaHVicy9zZXNzaW9uX2h1YiIsImlhdCI6MTY3OTQ0MTQ4NCwiZXhwIjoxNjc5NDc3NDg0LCJzdWIiOiIxIn0.ZRWOfQ7-pnuDNjuoF0bJmAOZoYMyN-hvtACCIyc7K9Y'
const api = new GameAPI(sessionId, apiToken);

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
  gameId: number,
  color: "black" | "white" | undefined,  
  cgApi: cgApi | null,
  white: number,  // Did this as nested interfaces first but was not desirable. See: https://stackoverflow.com/a/51136076
  black: number,
  alertText: string,
  showProposedRules: boolean,
  proposedRules: rule[],
  activeRules: rule[],
  waitingOnNextRound: boolean
};
class Game extends React.Component<{}, state> {
  constructor(props:any) {
    super(props);

    this.state = {
      gameId: 5,
      color: "white",
      cgApi: null, 
      white: 0,
      black: 0,
      alertText: "", 
      showProposedRules: false,
      proposedRules: [],
      activeRules: [],
      waitingOnNextRound: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.buttonClick = this.buttonClick.bind(this);
    this.getOpponent = this.getOpponent.bind(this);
    this.onPlayerMove = this.onPlayerMove.bind(this);
  }

  componentDidMount(): void {
    api.on('handshake', (color: "b"|"w") => {
      const cgColor = this.getCgColor(color); 
      this.setState({ color: cgColor });
      
      this.state.cgApi?.set({
        orientation: cgColor,
        movable: {
          color: cgColor === "white" ? "white" as cg.Color : undefined, // Can only move pieces if they are white
      }});
    })
    api.on('newState', (newState) => {
      const {boardstate, score, rules, cardSelection} = newState;
      console.log(newState);

      this.state.cgApi?.set({
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
        }
      }
    });
    api.connect();
  }

  // onOpponentMove(boardstate: boardstate, score: score, activerules: rule[], proposedrules: rule[]) {
  //   this.state.cgApi?.set({
  //     fen: boardstate.fen, // Move all pieces to newly updated board
  //     turnColor: this.state.color, // Make it so the pieces are moveable again
  //     movable: {
  //       color: this.state.color // Make it so the pieces are moveable again
  //     },
  //     selectable: {
  //       enabled: true,
  //     },
  //     draggable: {
  //       enabled: true,
  //     },
  //   }); 

  //   this.setState({
  //     black: score.black, 
  //     white: score.white,
  //     activeRules: activerules
  //   });
  // }

  // onRoundEnd(boardstate: boardstate, score: score, activerules: rule[], proposedrules: rule[]) {
  //   if (boardstate.won === " ") 
  //     throw new Error ("Round ended without winner, this is not possible and should likely be onOpponentMove instead")

  //   // Update game state and don't allow movement
  //   this.state.cgApi?.set({
  //     fen: boardstate.fen,
  //     turnColor: undefined,
  //     movable: {
  //       color: undefined 
  //     },
  //     selectable: {
  //       enabled: false,
  //     },
  //     draggable: {
  //       enabled: false,
  //     },
  //   });

  //   // Update the score and display alert
  //   const winner = this.getCgColor(boardstate.won)  
  //   this.setState({
  //     black: score.black, 
  //     white: score.white,
  //     activeRules: activerules,
  //     proposedRules: proposedrules,
  //     alertText: `${winner} WON ROUND ${this.state.black + this.state.white + 1}!`.toUpperCase()
  //   });

  //   // TODO: retrieve rules if enemy won 
  //   if (winner !== this.state.color) {
  //     this.handleShow();
  //   }
  // }

  // onRoundStart(boardstate: boardstate, score: score, activerules: rule[], proposedrules: rule[]) {
  //   // Update score and active rules (score should already be correct but why not update again if we get the values 🤷‍♂️)
  //   this.setState({
  //     black: score.black, 
  //     white: score.white,
  //     activeRules: activerules,
  //   });

  //   this.state.cgApi?.set({
  //     fen: boardstate.fen,
  //     turnColor: "white",
  //     movable: {
  //       color: this.state.color === "white" ? "white" as cg.Color : undefined, // Can only play if they are white because white starts the game
  //     }
  //   })
  // }

  // onGameEnd(boardstate: boardstate, score: score, activerules: rule[], proposedrules: rule[]) {
  //   if (boardstate.won === " ") 
  //     throw new Error ("Game ended without winner, this is not possible and should likely be onOpponentMove instead")

  //   // Disable board
  //   this.state.cgApi?.set({fen: boardstate.fen});
  //   this.state.cgApi?.stop();

  //   // Update score for the last time
  //   this.setState({
  //     black: score.black, 
  //     white: score.white,
  //     activeRules: activerules,
  //     alertText: `${this.getCgColor(boardstate.won)} WON!`.toUpperCase()
  //   });
  // }

  onPlayerMove(from: cg.Key, to: cg.Key) {
    //TODO: Send move to api, if valid -> change board, otherwise retry
    const move = `${from}-${to}`;
    api.action({action:2, move: move});

    // callAzureFunction(`gameid=${5}&color=${this.state.color?.charAt(0)}&action=${2}&move=${move}`).then(value => {
    //   const currentPlayer = this.getCgColor(value.boardstate.fen.split(" ")[1]); 
    //   const moveHasGoneThrough = currentPlayer !== this.state.color;

    //   if (moveHasGoneThrough) {
    //     // Give move to opponent, make player unable to move
    //     const opponent = this.getOpponent();
    //     this.state.cgApi?.set({
    //       turnColor: opponent,
    //       selectable: {
    //         enabled: false,
    //       },
    //       draggable: {
    //         enabled: false,
    //       },
    //     });
    //   } else {
    //     this.setState({alertText: `INVALID MOVE ${move}!`});
    //     this.state.cgApi?.move(to, from)
    //   }
    // }).catch((error) => {
    //   this.setState({alertText: `ERROR SENDING MOVE: ${error}`});
    //   this.state.cgApi?.move(to, from)
    // });
  }

  onRuleChoose(ruleIndex: number) {
    api.action({action: 3, choice: ruleIndex});
  }
  
  handleRuleClicked = (ruleIndex:number) => {this.onRuleChoose(ruleIndex)}
  handleClose = () => this.setState({showProposedRules: false});
  handleShow = () => this.setState({showProposedRules: true});

  render() {
    const chessConfig = {
      animation: {
        enabled: true,
        duration: 1000
      },
      movable: {
        events: {
          after: this.onPlayerMove
        }
      },
    };

    //TODO: Show active cards
    return (
      <div className="full-background h-100 d-flex flex-column min-vh-100 justify-content-center align-items-center">
        {
          this.state.color !== undefined ? (
            <>
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
          ) : (
            <div>
              <h1> Waiting for opponent </h1>
              <Spinner animation="grow" variant="light" />
            </div>
          )}
      </div>
    );
  }

  // ======================
  // Help functions
  // ======================

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
