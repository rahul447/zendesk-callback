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
      name: "zendesk-callback",
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
    "environmentVariableChecker": {
      "isEnabled": false
    },
    "urlPrefix": "/zendesk-callback",
    "firebaseDetails" : {
      "apiKey": "AIzaSyDL_IlplfGXyGi03nehvFxqDplH5tc7Eio",
      "authDomain": "api-project-164414928618.firebaseapp.com",
      "databaseURL": "https://api-project-164414928618.firebaseio.com",
      "projectId": "api-project-164414928618",
      "storageBucket": "api-project-164414928618.appspot.com",
      "messagingSenderId": "164414928618"
    },
   "firebaseDbKeys":{
      "Comments": "ticketComment",
      "NewTicket": "newTicket"
    },
  };

module.exports = config;

// eslint enable no-var
