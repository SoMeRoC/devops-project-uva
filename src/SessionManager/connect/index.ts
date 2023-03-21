import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Session } from "../db";

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
  let { sessionId } = wpsReq.request.query;
  const { userId } = wpsReq.request.connectionContext;

  if (!sessionId || sessionId.length !== 1) {
    return {
      status: 400,
      body: 'Required parameter "sessionId" not supplied.',
    };
  }

  sessionId = sessionId[0];
  const session = await Session.findOne({ where: { id: sessionId } });
  if (!session) {
    return {
      status: 404,
      body: 'Session not found',
    };
  }

  if (session.dataValues.black !== userId && session.dataValues.white !== userId) {
    return {
      status: 401,
      body: 'You are not a player in this session.',
    };
  }

  const color = session.dataValues.white === userId ? 'w' : 'b';

  context.bindings.actions = [{
    actionName: 'addUserToGroup',
    userId: userId,
    group: `session-${sessionId}`,
  }, {
    actionName: 'sendToGroup',
    group: `session-${sessionId}`,
    data: JSON.stringify({ event: 'playerConnected', color: color }),
    dataType: 'json',
  }];


  return { status: 200 };
};

export default ConnectUser;
