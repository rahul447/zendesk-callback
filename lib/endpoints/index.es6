"use strict";

import express from "express";
import {ticketService} from "./services/ticketService";
import {firebaseService} from "./services/firebaseService";

let router = express.Router(),
{NODE_ENV} = process.env,
nodeEnv = NODE_ENV || "local",
config = Object.freeze(require("../../config/" + nodeEnv)),

zendeskCallback = router.route("/"),
firebaseServiceObject = new firebaseService(config),
ticketServiceObject = new ticketService(config, firebaseServiceObject);

zendeskCallback.get(ticketServiceObject.getRequestType.bind(ticketServiceObject));

export {router};

