import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Op } from "sequelize";
import { Session } from "../db";

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<Object> {
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
      actionName: 'sendToConnection',
      connectionId,
      data: JSON.stringify({ event: 'handshake', color })
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
