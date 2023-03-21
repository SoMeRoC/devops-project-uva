import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Session } from "../db";
import gameApi from "../gameApi";

const GameAction: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
  context.log(wpsReq, wpsReq.request.data);
  return {
    body: wpsReq.request.data,
  };
  const { sessionId, uid, move } = context.bindingData.connectionContext;

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


  // Propagate action, broadcast result.
  const res = await gameApi.action(sessionId, color, move);

  context.bindings.actions = [
    {
      actionName: 'sendToGroup',
      group: `session-${sessionId}`,
      data: res,
      dataType: 'json',
    }
  ];
};

export default GameAction;
