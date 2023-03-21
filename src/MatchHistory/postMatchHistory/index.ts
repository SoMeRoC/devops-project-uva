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


const PostMatchHistory: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const match = await Match.create(req.body, {
    include: [MatchPlayer, MatchRound]
  });
  const matchId = match.dataValues.id;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: { id: matchId }
  };
};


export default PostMatchHistory;