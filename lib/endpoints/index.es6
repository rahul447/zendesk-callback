"use strict";

import express from "express";
import {testService} from "./services/testService";

let router = express.Router(),
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  testCallback = router.route("/testCallback"),
  test = new testService(config);

testCallback.get(test.testCallback.bind(test));

export {router};

