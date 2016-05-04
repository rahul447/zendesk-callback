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
      level: environmentVariables.FOCUS_LOGGING_LEVEL,
      "console": true,
      "path": "/var/log/focus-api.log"
    },
    "mongoDb": {
      "connectionString": environmentVariables.FOCUS_MONGO_CONNECTION_STRING,
      "operationTimeout": 4000,
      "connectionOptions": {
        "server": {
          "poolSize": 5,
          "socketOptions": {
            "autoReconnect": true,
            "keepAlive": 0
          },
          "reconnectTries": 30,
          "reconnectInterval": 1000
        }
      },
      "promiseTimeout": 4500
    },
    "authorization": {
      "authorize": false
    },
    "caching": {
      "host": environmentVariables.FOCUS_REDIS_HOST,
      "port": environmentVariables.FOCUS_REDIS_PORT,
      "ttl": 24 * 60 * 60
    },
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "urlPrefix": "/focus-api",
    "preferences": {
      "entitlements": ["financial", "y", "z"]
    },
    "publicUrls": ["/focus-api/login"],
    "smtp": {
      "host": "smtp.apptixemail.net",
      "port": 587,
      "auth": {
        "user": "info@cantahealth.com",
        "pass": "reset@1234"
      }
    },
    "fhirValidator": {
      "baseURI": {
        "protocol": "http",
        "domain": "127.0.0.1",
        "port": 8050,
        "version": "baseDstu2"
      }
    }
  };

module.exports = config;

// eslint enable no-var
