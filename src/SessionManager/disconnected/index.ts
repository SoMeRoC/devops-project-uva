import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from "sequelize";
import { Session } from "../db";

const DisconnectUser: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
  const { connectionId } = wpsReq.request.connectionContext;

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

  context.bindings.actions = [
    {
      actionName: 'sendToGroup',
      group: `session-${sessionId}`,
      data: JSON.stringify({ event: 'playerDisconnected', color: color }),
    },
  ];
};

export default DisconnectUser;
