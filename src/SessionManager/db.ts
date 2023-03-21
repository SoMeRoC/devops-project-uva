import { Sequelize, DataTypes, Model } from "sequelize";
import { sql } from './config.js';

const sequelize = process.env.SqlConnectionString ?
  new Sequelize(`Server=tcp:sql-someroc-shared-dev.database.windows.net,1433;Initial Catalog='sqldb-session-dev';Persist Security Info=False;User ID='someroc_admin';Password='WFvDnllSof9DsDDd';MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;`) :
  new Sequelize(sql.database, sql.userName, sql.password, {
    host: sql.hostName,
    dialect: sql.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

export class Session extends Model { };
Session.init({
  start: DataTypes.DATE,
  black: DataTypes.STRING,
  blackConId: DataTypes.STRING,
  white: DataTypes.STRING,
  whiteConId: DataTypes.STRING,
}, { sequelize, modelName: 'session' });

sequelize.sync({ force: process.env.NODE_ENV === 'development' })
