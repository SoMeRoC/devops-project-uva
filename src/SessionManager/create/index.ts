import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Session } from "../db";

const CreateSessions: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  console.log(process.env, process.env.SqlConnectionString);
  const { players } = req.body;
  if (!players || players.length !== 2) {
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
