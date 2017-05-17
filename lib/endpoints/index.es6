"use strict";

import express from "express";
import {CommentUpdateService} from "./services/CommentUpdateService";
import {firebaseService} from "./services/firebaseService";

let router = express.Router(),
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  testCallback = router.route("/testCallback"),
  firebaseServiceObject = new firebaseService(config),
  CommentUpdateServiceObject = new CommentUpdateService(config, firebaseServiceObject);

testCallback.get(CommentUpdateServiceObject.extractTicketId.bind(CommentUpdateServiceObject));

export {router};

