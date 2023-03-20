import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Session } from "../db";

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { sessionId, uid } = req.query;

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


  context.res = {
    body: {
      color: color,
    }
  }
  return;
};

export default ConnectUser;
