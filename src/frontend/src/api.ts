import EventEmitter from "events";

const hub = 'session_hub';

export default class GameAPI extends EventEmitter {
  sessionId: string
  apiToken: string
  socket: undefined | WebSocket
  connecting: boolean
  connected: boolean
  game: undefined | { color: 'w' | 'b' }

  constructor(sessionId: string, apiToken: string) {
    super();
    if (!sessionId || !apiToken) { throw new Error('No sessionId and/or apiToken supplied!') }
    this.sessionId = sessionId;
    this.apiToken = apiToken;
    this.connecting = false;
    this.connected = false;
  }

  connect() {
    if (this.connecting || this.connected) { return; }

    this.connecting = true;
    this.socket = new WebSocket(`wss://wps-someroc-dev.webpubsub.azure.com/client/hubs/${hub}?sessionId=${this.sessionId}&access_token=${this.apiToken}`); //, 'json.webpubsub.azure.v1');

    this.socket.addEventListener('open', this.onOpen);
    this.socket.addEventListener('message', this.onMessage);
    this.socket.addEventListener('error', this.onError);
    this.socket.addEventListener('close', this.onClose);
  }

  onOpen = () => {
    this.connecting = false;
    this.connected = true;
    console.info(`WebSocket session ${this.sessionId} connected.`);
  }


  onMessage = (event: MessageEvent) => {
    let { data } = event;
    data = JSON.parse(data);

    switch (data.event) {
      case 'handshake':
        this.game = {
          color: data.color,
        };
        this.emit(data.event, this.color, data.board);
        break;

      case 'playerConnected':
      case 'playerDisconnected':
        this.emit(data.event);
        break;

      case 'newState':
        this.emit(data.event, data.newState);
        break;

      default:
        console.warn(`Unkown event received ${data.event}.`, data);
        break;
    }

  }

  onError = (event: Event) => {
    console.error(`WebSocket error for session ${this.sessionId}: `, event);
  }

  onClose = () => {
    this.connected = false;
    console.info(`WebSocket session ${this.sessionId} closed.`);
  }

  get color() {
    return this.game?.color;
  }

  action(payload: { action: 2, move: String } | { action: 3, choice: number }) {
    if (!this.socket || !this.connected) { throw new Error('Socket not connected!'); }

    this.socket.send(JSON.stringify(payload));
  }
}
