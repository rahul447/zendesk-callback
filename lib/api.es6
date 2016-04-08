"use strict";

import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import mwAllowCrossDomain from "./middleware_services/mwAllowCrossDomain";
import mwErrorHandler from "./middleware_services/mwErrorHandler";
import mwAuthenticate from "./middleware_services/mwAuthenticate";
import mwcheckEntitlement from "./middleware_services/mwcheckEntitlement";
import checkEnvironmentVariables from "./util/checkEnvironmentVariables";
import {router} from "./endpoints";

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  // urlPrefix = config.urlPrefix,
  environmentVariables = require("../config/environmentVariables");

// Checks the required enviro// Defines top middleware and routesnment variables
// Logs the missing environment variables and exit the application
if (config.environmentVariableChecker.isEnabled) {
  checkEnvironmentVariables(environmentVariables);
}

// Sets the relevant config app-wise
app.set("port", config.http.port);

// Defines top middleware and routes
app.use(mwAllowCrossDomain);
app.use(mwAuthenticate);
app.use(mwcheckEntitlement);
app.use(bodyParser.json());
app.use("/", router);

app.use(methodOverride);
app.use(mwErrorHandler);

// Starts the app
app.listen(app.get("port"), function () {
  console.log("Server has started and is listening on port: " + app.get("port"));
});
