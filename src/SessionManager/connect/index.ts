import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import connectToDatabase, { Session } from "../db";
import * as sql from 'mssql';

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
  let { sessionId } = wpsReq.request.query;
  const { userId, connectionId } = wpsReq.request.connectionContext;

  if (!sessionId || sessionId.length !== 1) {
    return {
      status: 400,
      body: 'Required parameter "sessionId" not supplied.',
    };
  }

  sessionId = parseInt(sessionId[0]);

  const pool = await connectToDatabase(context);
  const result = await pool.request()
  .input('sessionId', sql.Int, sessionId)
  .query('SELECT * FROM dbo.ChessGames WHERE id = @sessionId');
  if (!result || result.recordset.length !== 1) {
    return {
      status: 400,
      body: 'Session not found',
    };
  }

  const session: Session = result.recordset[0];
  context.log('session: ', session)
  if (!session) {
    return {
      status: 404,
      body: 'Session not found',
    };
  }

  if (session.black !== userId && session.white !== userId) {
    return {
      status: 401,
      body: 'You are not a player in this session.',
    };
  }

  const color = session.white === userId ? 'w' : 'b';

  await pool.request()
    .input('sessionId', sql.Int, sessionId)
    .input('connectionId', sql.VarChar(100), connectionId)
    .query(`UPDATE dbo.ChessGames SET ${color === 'w' ? 'whiteConId = @connectionId' : 'blackConId = @connectionId'} WHERE id = @sessionId`);
};

export default ConnectUser;
