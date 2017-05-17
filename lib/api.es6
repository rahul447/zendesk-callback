"use strict";

import express from "express";
import bodyParser from "body-parser";
import mwAllowCrossDomain from "./middleware_services/mwAllowCrossDomain";
import {router} from "./endpoints/index";
import domain from "express-domain-middleware";

let {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../config/" + nodeEnv)),
  app = express(),
  urlPrefix = config.urlPrefix,
  environmentVariables = require("../config/environmentVariables");

// Sets the relevant config app-wise
app.use(domain);
app.set("port", config.http.port);
app.set("domain", config.http.domain);
app.use(mwAllowCrossDomain);
app.use(bodyParser.json());

app.use(`${urlPrefix}`, router);

// Starts the app
app.listen(app.get("port"), app.get("domain"), function () {
  console.log("Server has started and is listening on port: " + app.get("port") + " and ip : " + app.get("domain"));
});
