import React from "react";
import GameAPI from "../api";

const sessionId = '3';
const apiToken1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly93cHMtc29tZXJvYy1kZXYud2VicHVic3ViLmF6dXJlLmNvbS9jbGllbnQvaHVicy9zZXNzaW9uX2h1YiIsImlhdCI6MTY3OTQzOTkxNCwiZXhwIjoxNjc5NDc1OTE0LCJzdWIiOiIxIn0.RTbDQvP4JZWq_6ZndR_XCaoEnMJvKbGqRXTO-I292z4';
const apiToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3c3M6Ly93cHMtc29tZXJvYy1kZXYud2VicHVic3ViLmF6dXJlLmNvbS9jbGllbnQvaHVicy9zZXNzaW9uX2h1YiIsImlhdCI6MTY3OTQzOTg5MSwiZXhwIjoxNjc5NDc1ODkxLCJzdWIiOiIyIn0.7o8xcflgADo51Km9yJ7RyxAJ6rMRYGMgskBVrw0SKzQ';
const api = new GameAPI(sessionId, apiToken1);

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
    // api.action(input.value);
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
