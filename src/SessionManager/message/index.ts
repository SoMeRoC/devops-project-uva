import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from "sequelize";
import { Session } from "../db";
import gameApi from "../gameApi";


const GameAction: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
  const { connectionId } = wpsReq.request.connectionContext;
  const move = wpsReq.request.data;
  const session = await Session.findOne({
    where:
    {
      [Op.or]: [
        { blackConId: connectionId },
        { whiteConId: connectionId }
      ]
    }
  });
  if (!session) {
    context.res = { status: 404, body: 'Session not found.' }
    return;
  }

  const sessionId = session.dataValues.id;
  const color = session.dataValues.whiteConId === connectionId ? 'w' : 'b';

  // Propagate action, broadcast result.
  // const res = await gameApi.action(sessionId, color, move);
  const res = `session-${sessionId} Player ${color} made move: ${move}`;

  context.bindings.actions = [
    {
      actionName: 'sendToGroup',
      group: `session-${sessionId}`,
      data: JSON.stringify({ event: 'newState', newState: res }),
    }
  ];
};

export default GameAction;
