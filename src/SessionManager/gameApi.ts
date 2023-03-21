import axios from "axios";

const gameConf = {
  url: process.env.GAME_URL || 'https://func-someroc-gameengine-dev.azurewebsites.net/api',
  apiToken: process.env.API_TOKEN || '', // ?code=
}

const gameService = axios.create({
  baseURL: gameConf.url,
  params: {
    code: gameConf.apiToken,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + gameConf.apiToken,
  },
});

const gameApi = {
  action: (gameId: Number | String, color: String, payload: Object) => {
    return gameService.get('/MakeMove', {
      data: {
        ...payload,
        gameId,
        color,
      }
    });
  },
};

export default gameApi;
