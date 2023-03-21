import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Session } from "../db";

const CreateSessions: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log("1");
  const { players } = req.body;
  context.log(players);
  context.log("2");
  if (!players || players.length !== 2) {
    context.log("3");
    context.res = {
      status: 400,
      body: 'Specify exactly two players',
    }

    return;
  }

  const session = await Session.create({
    start: new Date(),
    white: players[0],
    black: players[1],
  })

  context.res = {
    body: session.dataValues.id,
  }
  return;
};

export default CreateSessions;
