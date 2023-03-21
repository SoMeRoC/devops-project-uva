import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const Diconnect: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  return;

  const { userId, sessionId } = context.bindingData.connectionContext;

  context.bindings.actions = [
    {
      actionName: 'RemoveUserFromGroup',
      userId: userId,
      group: `session-${sessionId}`,
    }
  ];
  return;
};

export default Diconnect;
