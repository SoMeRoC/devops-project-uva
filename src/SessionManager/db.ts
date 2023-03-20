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

export class Session extends Model { };
Session.init({
  start: DataTypes.DATE,
  black: DataTypes.STRING,
  white: DataTypes.STRING,
}, { sequelize, modelName: 'session' });

sequelize.sync({ force: process.env.NODE_ENV === 'development' })
