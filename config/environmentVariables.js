"use strict";

// eslint disable no-var

var environmentVariables = {
  "FOCUS_MONGO_CONNECTION_STRING": process.env.FOCUS_MONGO_CONNECTION_STRING || "mongodb://10.18.6.110:27017/fhir_eccpa_0908",
  "FOCUS_REDIS_HOST": process.env.FOCUS_REDIS_HOST || "localhost",
  "FOCUS_REDIS_PORT": process.env.FOCUS_REDIS_PORT || "6379",
  "FOCUS_LOGGING_LEVEL": process.env.FOCUS_LOGGING_LEVEL || "debug",
  "FOCUS_AUTH_SECRET_KEY": process.env.FOCUS_AUTH_SECRET_KEY || "45a3c06e-ab7e-4256-9e9c-da2ac168ef25"
};

module.exports = environmentVariables;

// eslint enable no-var
