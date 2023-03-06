import "./loadEnvironment.js";
import createDebug from "debug";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";

const port: string | number = process.env.PORT ?? 4000;
const mongoDbConnectionUrl: string = process.env.MONGODB_CONNECTION_URL!;

const debug = createDebug("server:root");

try {
  await startServer(+port);
  debug(`Server listening on port ${port}`);

  await connectDatabase(mongoDbConnectionUrl);
  debug(`Connected to database ${mongoDbConnectionUrl}`);
} catch (error: unknown) {
  debug((error as Error).message);
}
