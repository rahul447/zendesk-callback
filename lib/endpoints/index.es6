"use strict";

import merge from "deepmerge";
import express from "express";
import mongodb from "mongodb";
import Q from "q";
import loggerInstance from "../util/FocusApiLogger";
import {getGenericRepoInstance} from "../endpoints/generic/GenericRepository";
import {DomainService} from "./services/domainService";
// import {getGenericServiceInstance} from "./services/GenericService";
import {DrillService} from "./services/drillService";
import {EmailService} from "./services/emailService";
import {LeaderShipService} from "./services/leadershipService";
import {LoginService} from "./services/loginService";
import {getGenericServiceInstance} from "./services/GenericService";
import mwcheckEntitlement from "../middleware_services/mwcheckEntitlement";
import NodeMailer from "ch-nodemailer";
let router = express.Router(),
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  domainRoute = router.route("/domain/:name"),
  drillRoute = router.route("/domain/:name/:group/:portlet"),
  leadershipRoute = router.route("/leadership"),
  emailRoute = router.route("/sendmail"),
  pdfRoute = router.route("/download"),
// leadershipActionableRoute = router.route("/actionable/:id"),
  loginRoute = router.route("/login"),
  genericRepo = getGenericRepoInstance({"config": config, "mongodb": mongodb, "loggerInstance": loggerInstance}),
  genericService = getGenericServiceInstance(genericRepo, loggerInstance, mongodb),
  domainService = new DomainService(genericRepo, loggerInstance, Q, merge),
  loginService = new LoginService(genericRepo, loggerInstance),
  leadershipService = new LeaderShipService(genericRepo, loggerInstance, Q, merge),
  drillService = new DrillService(genericRepo, loggerInstance, Q, merge),
  nodeMailerInstance = new NodeMailer(config.smtp),
  emailService = new EmailService(loggerInstance, genericService, nodeMailerInstance);

domainRoute
  .get(mwcheckEntitlement)
  .get(domainService.getDomainDashboard.bind(domainService));

loginRoute
  .post(loginService.login.bind(loginService));

leadershipRoute
  .get(leadershipService.getLeadershipDashboard.bind(leadershipService));

drillRoute
  .get(drillService.getDrillDashboard.bind(drillService));

emailRoute
  .get(emailService.sendmail.bind(emailService));

pdfRoute.get(genericService.generatePDF.bind(genericService));

export {router};
