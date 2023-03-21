import axios from "axios";

const gameConf = {
  url: process.env.gameUrl || 'https://func-someroc-gameengine-dev.azurewebsites.net/api',
  apiToken: process.env.gameApi || '', // ?code=
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
      params: {
        ...payload,
        gameId,
        color,
      }
    });
  },
};

export default gameApi;
