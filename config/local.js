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
      "streams": [
        {
          "path": "/var/log/focus"
        }
      ]
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
      "ttl": 24*60*60
    },
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "urlPrefix": "/focus",
    "preferences": {
      "entitlements": ["financial", "y", "z"]
    },
    "publicUrls": ["/login"],
    "smtp": {
      "host": "smtp.apptixemail.net",
      "port": 587,
      "auth": {
        "user": "mdoffice@cantahealth.com",
        "pass": "Password@123"
      }
    }
  };

module.exports = config;

// eslint enable no-var
