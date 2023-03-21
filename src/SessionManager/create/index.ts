import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import ConnectToDatabase from "../db_azure";

const sql = require('mssql');

const connectionString = (process.env.SqlConnectionString as string)

interface schema {
  start: Date,
  black: string,
  blackConId?: string,
  white: string,
  whiteConId?: string
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
    const pool = await ConnectToDatabase(context, connectionString);

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
    context.log("ID:");
    context.log(result.recordset[0].id);
    context.res = {
      status: 200,
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
