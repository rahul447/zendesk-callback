"use strict";

import express from "express";
import {CommentUpdateService} from "./services/CommentUpdateService";
import {NewTicketService} from "./services/NewTicketService";
import {firebaseService} from "./services/firebaseService";

let router = express.Router(),
{NODE_ENV} = process.env,
nodeEnv = NODE_ENV || "local",
config = Object.freeze(require("../../config/" + nodeEnv)),
commentsCallback = router.route("/" + config.firebaseDbKeys.Comments),
newTicketCallback = router.route("/" + config.firebaseDbKeys.NewTicket),
firebaseServiceObject = new firebaseService(config),
CommentUpdateServiceObject = new CommentUpdateService(config, firebaseServiceObject),
NewTicketServiceObject = new NewTicketService(config, firebaseServiceObject);

commentsCallback
    .get(CommentUpdateServiceObject.extractTicketId.bind(CommentUpdateServiceObject));

newTicketCallback
    .get(NewTicketServiceObject.trackNewTicket.bind(NewTicketServiceObject));

export {router};

