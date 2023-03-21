import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import connectToDatabase, { Session } from "../db";
import * as sql from 'mssql';


const CreateSessions: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { players } = req.body;
  if (!players || players.length !== 2) {
    context.res = {
      status: 400,
      body: 'Specify exactly two players',
    }

    return;
  }

  const pool = await connectToDatabase(context);

  const session: Session = {
    start: new Date(),
    white: players[0],
    black: players[1]
  };

  const result = await pool.request()
  .input('start', sql.Date, session.start)
  .input('white', sql.VarChar(100), session.white)
  .input('black', sql.VarChar(100), session.black)
  .query('INSERT INTO dbo.ChessGames (start, white, black) OUTPUT inserted.id VALUES (@start, @white, @black)');

  context.res = {
    body: result.recordset[0].id
  }
  return;
};

export default CreateSessions;
