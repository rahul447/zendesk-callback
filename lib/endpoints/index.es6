"use strict";

import express from "express";
import {DomainService} from "./services/domainService";
import mongodb from "mongodb";
import loggerInstance from "../util/FocusApiLogger";
import {getGenericRepoInstance} from "../endpoints/generic/GenericRepository";

let router = express.Router(),
  domainRoute = router.route("/domain/:name/:userId"),
// domainPortletRoute = router.route("/domain/:name/:groupId/:portletId"),
// leadershipRoute = router.route("/leadership"),
// leadershipActionableRoute = router.route("/actionable/:id"),
// loginRoute = router.route("/login");
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  genericRepo, domainService;

genericRepo = getGenericRepoInstance({"config": config, "mongodb": mongodb, "loggerInstance": loggerInstance});
domainService = new DomainService(genericRepo, loggerInstance, mongodb);

domainRoute
  .get(domainService.getDashboard.bind(domainService));

export default router;
