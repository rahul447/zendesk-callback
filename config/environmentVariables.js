"use strict";

// eslint disable no-var

var environmentVariables = {
  "REDIS_HOST": process.env.REDIS_HOST || "localhost",
  "REDIS_PORT": process.env.REDIS_PORT || "6379",
  "LOGGING_LEVEL": process.env.LOGGING_LEVEL || "debug"
};

module.exports = environmentVariables;

// eslint enable no-var
