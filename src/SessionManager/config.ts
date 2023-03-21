import { Dialect } from "sequelize"

type SQLConfig = {
  hostName: string
  userName: string
  password: string
  database: string
  dialect: Dialect
  dialectOptions: Object
}

export const sql: SQLConfig = {
  hostName: process.env.MYSQL_HOST || 'db',
  userName: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'sessionManager',
  dialect: process.env.MYSQL_DIALECT as Dialect || 'mysql', // mssql for azure
  dialectOptions: process.env.MYSQL_DIALECT_OPTIONS ? JSON.parse(process.env.MYSQL_DIALECT_OPTIONS) : {}, // { encrypt: true } for azure
}

export const gameService = {
  url: process.env.GAME_URL || 'http://localhost:3003/',
  apiToken: process.env.API_TOKEN || '',
}
