import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import { Session } from "../db";
// import ConnectToDatabase from "../db";

const sql = require('mssql');

const connectionString = (process.env.SqlConnectionString as string)

interface schema {
  start: Date,
  black: string,
  blackConId?: string,
  white: string,
  whiteConId?: string
}

async function connectToDatabase(context: Context, connectionString) {
  try {
      const pool = await sql.connect(connectionString);
      context.log('Successfully connected to the database.');
      return pool;
  } catch (error) {
      context.log('Error connecting to the database:', error);
      throw error;
  }
}

const CreateSessions: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log("1");
  const { players } = req.body;
  context.log(players);
  context.log("2");
  if (!players || players.length !== 2) {
    context.log("3");
    context.res = {
      status: 400,
      body: 'Specify exactly two players',
    }

    return;
  }

  try {
    const pool = await connectToDatabase(context, connectionString);

    const session: schema = {
      start: new Date(),
      white: players[0],
      black: players[1]
    };
    context.log(session.start);
    context.log(typeof session.start);
    context.log(session.white);
    context.log(session.black);

    const result = await pool.request()
    .input('start', sql.Date, session.start)
    .input('white', sql.VarChar(100), session.white)
    .input('black', sql.VarChar(100), session.black)
    .query('INSERT INTO dbo.ChessGames (start, white, black) OUTPUT inserted.id VALUES (@start, @white, @black)');

    // const session : schema = {
    //   start: new Date(),
    //   white: players[0],
    //   black: players[1],
    // };

    context.log(result);
    context.res = {
      body: result.recordset[0].id
    }
  } catch (error) {
    context.res = {
      status: 200,
      body: error.toString(),
    }
  }
  return;
};

export default CreateSessions;
