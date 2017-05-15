"use strict";

// eslint disable no-var

var environmentVariables = require("./environmentVariables"),
  config = {
    "http": {
      "protocol": "http",
      "domain": "127.0.0.1",
      "port": 8010
    },
    "logger": {
      name: "focus-api",
      "streams": [
        {
          "level": environmentVariables.LOGGING_LEVEL,
          "stream": process.stdout
        },
        {
          "level": environmentVariables.LOGGING_LEVEL,
          "path": "/var/log/zendesk-callback/api-debug.log"
        },
        {
          "level": "info",
          "path": "/var/log/zendesk-callback/api-info.log"
        }
      ]
    },
    "authorization": {
      "authorize": false
    },
    "caching": {
      "host": environmentVariables.REDIS_HOST,
      "port": environmentVariables.REDIS_PORT,
      "ttl": 24 * 60 * 60
    },
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "tokenExpireIn": 7200,
    "urlPrefix": "/",
  };

module.exports = config;

// eslint enable no-var
