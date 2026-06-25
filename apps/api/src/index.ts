import { loadEnvironment } from "@genki/config";
import { logger } from "@genki/logger";
import { createApp } from "./app";

const environment = loadEnvironment();
const app = createApp().listen(environment.APP_PORT);

logger.info("server_started", {
  environment: environment.APP_ENV,
  port: environment.APP_PORT,
});

console.log(
  `Genki API em http://${app.server?.hostname}:${app.server?.port}/api/v1`,
);

export type App = typeof app;
