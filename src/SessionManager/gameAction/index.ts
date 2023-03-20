import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Session } from "../db";
import gameApi from "../gameApi";

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { sessionId, uid, move } = req.query;

  const session = await Session.findOne({ where: { id: sessionId } });
  if (!session) {
    context.res = { status: 404, body: 'Session not found.' }
    return;
  }

  if (session.dataValues.black !== uid && session.dataValues.white !== uid) {
    context.res = { status: 401, body: 'You are not a player in this session.' }
    return;
  }

  const color = session.dataValues.white === uid ? 'w' : 'b';


  // Propagate action, return result.
  const res = await gameApi.action(sessionId, color, move);

  context.res = {
    status: res.status,
    body: res.data,
  }
  return;
};

export default ConnectUser;
