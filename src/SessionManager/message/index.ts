import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import connectToDatabase, { Session } from "../db";
import * as sql from 'mssql';
import gameApi from "../gameApi";


const GameAction: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
  const { connectionId } = wpsReq.request.connectionContext;
  const payload = wpsReq.request.data;
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

  // Propagate action, broadcast result.
  let res: any;
  try {
    res = await gameApi.action(sessionId, color, payload);
  } catch (error) {
    context.bindings.actions = [
      {
      actionName: 'sendToGroup',
      group: `session-${sessionId}`,
      data: JSON.stringify({ event: 'error', input: payload, error: error }),
      }
    ]
    return;
  }
  // const res = `session-${sessionId} Player ${color} made move: ${move}`;

  context.bindings.actions = [
    {
      actionName: 'sendToGroup',
      group: `session-${sessionId}`,
      data: JSON.stringify({ event: 'newState', newState: res }),
    }
  ];
};

export default GameAction;
