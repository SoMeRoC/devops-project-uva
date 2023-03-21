import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Session } from "../db";

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Object> {
  context.log('connecting');

  return {
    sessionId: 1,
    color: 'w',
    userId: 'hi',
  }
  const { sessionId, uid } = req.query;

  const session = await Session.findOne({ where: { id: sessionId } });
  if (!session) {
    return {
      code: 'not found',
      errorMessage: 'Session not found.',
    }
  }

  if (session.dataValues.black !== uid && session.dataValues.white !== uid) {
    return {
      code: 'unauthorized',
      errorMessage: 'You are not a player in this session.',
    }
  }

  const color = session.dataValues.white === uid ? 'w' : 'b';

  return {
    sessionId,
    color,
    userId: uid
  };
};

export default ConnectUser;
