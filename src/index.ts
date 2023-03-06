import "./loadEnvironment.js";
import createDebug from "debug";
import startServer from "./server/startServer.js";

const port: string | number = process.env.PORT ?? 4000;

const debug = createDebug("server:root");

try {
  await startServer(+port);
  debug(`Server listening on port ${port}`);
} catch (error: unknown) {
  debug((error as Error).message);
}
