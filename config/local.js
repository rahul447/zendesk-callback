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
          "level": environmentVariables.FOCUS_LOGGING_LEVEL,
          "stream": process.stdout
        },
        {
          "level": environmentVariables.FOCUS_LOGGING_LEVEL,
          "path": "/var/log/focus/focus-api-debug.log"
        },
        {
          "level": "info",
          "path": "/var/log/focus/focus-api-info.log"
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
      "ttl": 24 * 60 * 60
    },
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "urlPrefix": "/focus-api",
    "preferences": {
      "entitlements": ["financial", "y", "z"]
    },
    "publicUrls": ["/focus-api/login", "/focus-api/logout", "/focus-api/requestResetPin", "/focus-api/checkResetPin", "/focus-api/changePassword", "/focus-api/validateUserToken"],
    "smtp": {
      "host": "smtp.apptixemail.net",
      "port": 587,
      "auth": {
        "user": "focus@cantahealth.com",
        "pass": "apple@1234"
      }
    },
    "drillLimit": 1000,
    "fhirValidator": {
      "baseURI": {
        "protocol": "http",
        "domain": "127.0.0.1",
        "port": 8050,
        "version": "baseDstu2"
      }
    },
    "AUTH_SECRET_KEY": environmentVariables.FOCUS_AUTH_SECRET_KEY,
    "tokenExpireIn": 7200,
    "limit": 50,
    "MaxInactivityTime": 1800
  };

module.exports = config;

// eslint enable no-var
