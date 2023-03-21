import { Context } from "@azure/functions"
import * as sql from 'mssql';

const connectionString = process.env.SqlConnectionString

export interface Session {
  id: undefined | Number
  start: Date,
  black: string,
  blackConId?: string,
  white: string,
  whiteConId?: string
}

export default async function connectToDatabase(context: Context) {
  try {
      const pool = await sql.connect(connectionString);
      return pool;
  } catch (error) {
      context.log('Error connecting to the database:', error);
      throw error;
  }
}

