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
  userName: process.env.MYSQL_USER || 'guest',
  password: process.env.MYSQL_PASSWORD || 'guest',
  database: process.env.MYSQL_DATABASE || 'matchHistory',
  dialect: process.env.MYSQL_DIALECT as Dialect || 'mysql', // mssql for azure
  dialectOptions: process.env.MYSQL_DIALECT_OPTIONS ? JSON.parse(process.env.MYSQL_DIALECT_OPTIONS) : {}, // { encrypt: true } for azure
}
