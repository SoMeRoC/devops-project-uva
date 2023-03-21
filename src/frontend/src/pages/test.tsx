import React from "react";
import GameAPI from "../api";

const sessionId = '1';
const apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly93cHMtc29tZXJvYy1kZXYud2VicHVic3ViLmF6dXJlLmNvbS9jbGllbnQvaHVicy9zZXNzaW9uX2h1Yl9kZXYiLCJpYXQiOjE2NzkzOTcwMjUsImV4cCI6MTY3OTQzMzAyNSwic3ViIjoiMSJ9.y-z_wvvM1SS3hCcHAoFjsMvSUnosZb4r56cmJI329Iw';
const api = new GameAPI(sessionId, apiToken);

class Test extends React.Component {
  ref: any
  state: { color: string, gameState: string }

  constructor(props: any) {
    super(props);

    this.state = {
      color: '',
      gameState: '',
    }
    this.ref = React.createRef();
  }

  componentDidMount(): void {
    api.on('handshake', (color) => {
      this.setState({ color: color });
    })
    api.on('newState', (newState) => {
      this.setState({ gameState: newState })
    });
    api.connect();
  }

  send = () => {
    const input = this.ref.current as HTMLInputElement
    api.action(input.value);
  }

  render() {
      return (
          <div className="full-background d-flex flex-column min-vh-100 justify-content-center align-items-center">
              <p>color: {this.state.color}</p>
              <p>gameState: {this.state.gameState}</p>
              <div>
                <input ref={this.ref} placeholder="Do a move" />
                <button onClick={this.send}>Send</button>
              </div>
          </div>
      )
  }
}
export default Test
