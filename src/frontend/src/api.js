import axios from 'axios';

const browser = typeof localStorage !== 'undefined';
// let apiCallback = (tokenData) => { };
let token = null;
let tokenData = null

const server = axios.create({
  baseURL: 'http://localhost:3001/api', // TODO: Make this the correct endpoint
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token,
  },
});

server.interceptors.response.use((response) => {
  if (response.data.error) { throw new Error(response.data.error); }
  if (response.status !== 200) { return response; }

  return response.data;
});

const unpackToken = (token) => {
  if (!token) { return null; }

  const split = token.split('.');
  if (split.length !== 3) {
    throw new Error(`Received invalid token. Token has ${split.length} parts, expected 3.`);
  }

  const payload = browser ? atob(split[1]) : (new Buffer.from(split[1], 'base64')).toString();
  return JSON.parse(payload);
}

const setToken = (newToken) => {
  token = newToken;
  tokenData = unpackToken(newToken);
}

setToken(localStorage.getItem('apiToken'))
const api = {
  setTokenChangeCallback: (fn) => {
    // apiCallback = fn;
  },

  getApiTokenData: () => {
    return tokenData;
  }
}

/* Socket payloads:

Make move: Payload with space is a move, single word is command
{ action: 'move', payload: 'e4 e5' }
{ action: 'move', payload: 'forfeitByTime' }
{ action: 'move', payload: 'forfeit' }

Receive move made:
{ action: 'updateState', payload: { FEN: '<FEN game board>' } }

Receive round end
{ action: 'roundEnd', payload: { winner: 'b' | 'w' } }

Receive game end
{ action: 'gameEnd', payload: { winner: 'b' | 'w' }}

 */

export default api;
