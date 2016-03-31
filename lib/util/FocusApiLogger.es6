"use strict";

// import chLogger from "ch-logger";

let instance = null,
  nodeEnv = process.env.NODE_ENV || "local",
  config = require("../../config/" + nodeEnv),
  loggerOptions = config.logger || {};

console.log("logger option", loggerOptions);

// instance = new chLogger(loggerOptions);

// instance.info("FHIR Api: Logger initialized.", instance);

export default instance;
