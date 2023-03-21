import { Context } from "@azure/functions"


const sql = require('mssql');

async function ConnectToDatabase(context: Context, connectionString) {
  try {
      const pool = await sql.connect(connectionString);
      context.log('Successfully connected to the database.');
      return pool;
  } catch (error) {
      context.log('Error connecting to the database:', error);
      throw error;
  }
}
export default ConnectToDatabase;

