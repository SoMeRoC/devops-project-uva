import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import connectToDatabase, { Session } from "../db";
import * as sql from 'mssql';
import gameApi from "../gameApi";

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
  const { connectionId } = wpsReq.request.connectionContext;

  const pool = await connectToDatabase(context);
  const result = await pool.request()
    .input('connectionId', sql.VarChar(100), connectionId)
    .query('SELECT * FROM dbo.ChessGames WHERE blackConId = @connectionId OR whiteConId = @connectionId');
  if (!result || result.recordset.length !== 1) {
    context.res = { status: 404, body: 'Session not found.' }
    return;
  }

  const session: Session = result.recordset[0];
  if (!session) {
    context.res = { status: 404, body: 'Session not found.' }
    return;
  }

  const sessionId = session.id;
  const color = session.whiteConId === connectionId ? 'w' : 'b';

  const res = await gameApi.action(sessionId, color, { action: 5 });
  context.bindings.actions = [
    {
      actionName: 'sendToConnection',
      connectionId,
      data: JSON.stringify({ event: 'handshake', color, board: res })
    },
    {
      actionName: 'AddConnectionToGroup',
      connectionId: connectionId,
      group: `session-${sessionId}`,
    },
    {
    actionName: 'sendToGroup',
    group: `session-${sessionId}`,
    data: JSON.stringify({ event: 'playerConnected', color: color }),
  },
  ];
};

export default ConnectUser;
