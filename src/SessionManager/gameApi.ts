import axios from "axios";
import { gameService as gameConf } from './config.js';

const gameService = axios.create({
  baseURL: gameConf.url,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + gameConf.apiToken,
  },
});

const gameApi = {
  action: (gameId: number | string, color: string, move: string) => {
    return gameService.get('/makeMove', {
      data: {
        gameId,
        color,
        move,
      }
    });
  },
};

export default gameApi;
