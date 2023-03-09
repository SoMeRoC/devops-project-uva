import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Sequelize, DataTypes, Model } from "sequelize";
import { sql } from './config.js';


const sequelize = new Sequelize(sql.database, sql.userName, sql.password, {
  host: sql.hostName,
  dialect: sql.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  dialectOptions: sql.dialectOptions
});

class MatchPlayer extends Model { };
MatchPlayer.init({
  role: DataTypes.CHAR(1),
  uid: DataTypes.STRING,
}, { sequelize, modelName: 'player' });

class MatchRound extends Model { };
MatchRound.init({
  round: DataTypes.INTEGER,
  winner: DataTypes.CHAR(1),
}, { sequelize, modelName: 'round' });

class Match extends Model { };
Match.init({
  winner: DataTypes.CHAR(1),
  rated: DataTypes.BOOLEAN,
}, { sequelize, modelName: 'match' });
Match.hasMany(MatchPlayer);
MatchPlayer.belongsTo(Match);
Match.hasMany(MatchRound);
MatchRound.belongsTo(Match);

sequelize.sync({ force: process.env.NODE_ENV === 'development' })

const GetMatchHistory: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { gameId, uid } = req.query;

  if (gameId && uid) {
    context.res = {
      status: 400,
      body: 'Supply either gameId or uid parameter'
    };
    return;
  }

  if (gameId) {
    const match = await Match.findOne({ where: { id: gameId }, include: [MatchPlayer, MatchRound] });
    if (!match) {
      context.res = { status: 404, body: 'Match not found' };
      return;
    }

    context.res = {
      body: match
    }
    return;
  }

  if (uid) {
    const matchIds = (await MatchPlayer.findAll({ where: { uid: uid } })).map((player) => player.dataValues.matchId);
    const matches = await Match.findAll({ where: { id: matchIds }, include: [MatchPlayer, MatchRound] })
    context.res = {
      body: matches,
    }
    return;
  }

  context.res = {
    status: 400,
    body: 'Specify either gameId or uid parameter',
  }
  return;
};

const PostMatchHistory: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const match = await Match.create({
    winner: 'b',
    rated: true,
    players: [
      { role: 'w', uid: 'player1UID' },
      { role: 'b', uid: 'player2UID' },
    ],
    rounds: [
      { round: 1, winner: 'b' },
      { round: 2, winner: 'w' },
    ]
  }, {
    include: [MatchPlayer, MatchRound]
  });
  const matchId = match.dataValues.id;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: { id: matchId }
  };
};

const Router: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  if (req.method === 'GET') {
    return GetMatchHistory(context, req);
  } else if (req.method === 'POST') {
    return PostMatchHistory(context, req);
  }

  context.res = {
    status: 400,
    body: 'Invalid method'
  }
  return;
};

export default Router;
