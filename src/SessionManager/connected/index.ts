import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const ConnectUser: AzureFunction = async function (context: Context, req: HttpRequest, wpsReq): Promise<void> {
  // context.log('connected', wpsReq);
  return;
  const { sessionId, userId, color } = context.bindingData.connectionContext;
  console.log('Connected', sessionId, userId, color)

  context.bindings.actions = [];
  context.bindings.actions.push({
    actionName: 'addUserToGroup',
    userId: userId,
    group: `session-${sessionId}`,
  });

  context.bindings.actions.push({
    actionName: 'SendToUser',
    userId: userId,
    data: {
      color
    },
    dataType: 'json',
  })
};

export default ConnectUser;
