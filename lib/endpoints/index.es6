"use strict";

import express from "express";
import mongodb from "mongodb";
import loggerInstance from "../util/FocusApiLogger";
import {getGenericRepoInstance} from "../endpoints/generic/GenericRepository";
import {DomainService} from "./services/domainService";
import {DrillService} from "./services/drillService";
import {EmailService} from "./services/emailService";
import {LeaderShipService} from "./services/leadershipService";
import {LoginService} from "./services/loginService";
import {LogoutService} from "./services/logoutService";
import {getGenericServiceInstance} from "./services/GenericService";
import {getEntitlementInstance} from "../middleware_services/mwcheckEntitlement";
import NodeMailer from "ch-nodemailer";
import {RedisCache} from "ch-redis-cache";
import {UserAuditLogService} from "./services/userAuditLogService";
import {ResetPasswordService} from "./services/resetpasswordService";

let router = express.Router(),
  {NODE_ENV} = process.env,
  nodeEnv = NODE_ENV || "local",
  config = Object.freeze(require("../../config/" + nodeEnv)),
  domainRoute = router.route("/domain/:name"),
  // paginationRoute = router.route("/domain/:name/:group/:portlet/:pageNumber"),
  drillRoute = router.route("/domain/:name/:group/:portlet"),
  customDrillRoute = router.route("/domain/:name/:group/:portlet/all"),
  leadershipRoute = router.route("/leadership"),
  emailRoute = router.route("/sendmail"),
  filterEmailRoute = router.route("/sendfilteredEmail"),
  pdfRoute = router.route("/download"),
  getAction = router.route("/getAll"),
  removeAction = router.route("/remove/:id"),
  fhirValidateRoute = router.route("/validatesingle/:endpoint/:id"),
  fhirValidateRoutemulti = router.route("/validate/fourthlevel"),
  loginRoute = router.route("/login"),
  logoutRoute = router.route("/logout"),
  userAuditLogRoute = router.route("/userAuditLog"),
  userAuditLogDownloadRoute = router.route("/userAuditLogDownload"),
  resetpasswordRoute = router.route("/requestResetPin"),
  changePasswordRoute = router.route("/changePassword"),
  validateuserTokenRoute = router.route("/validateUserToken"),
  redis = new RedisCache({"redisdb": config.caching, "logger": loggerInstance}),
  genericRepo = getGenericRepoInstance({"config": config, "mongodb": mongodb, "loggerInstance": loggerInstance}),
  genericService = getGenericServiceInstance(genericRepo, loggerInstance, mongodb, config),
  domainService = new DomainService(genericRepo, loggerInstance),
  loginService = new LoginService(genericRepo, loggerInstance, redis, config),
  logoutService = new LogoutService(loggerInstance, redis, config),
  leadershipService = new LeaderShipService(genericRepo, loggerInstance),
  drillService = new DrillService(genericRepo, loggerInstance, config),
  nodeMailerInstance = new NodeMailer(config.smtp),
  entitlementInstance = getEntitlementInstance(genericRepo, loggerInstance),
  emailService = new EmailService(loggerInstance, genericService, nodeMailerInstance, config),
  userAuditLogService = new UserAuditLogService(genericRepo, loggerInstance),
  resetPasswordService = new ResetPasswordService(genericRepo, loggerInstance, nodeMailerInstance, config);

domainRoute
  .get(entitlementInstance.getEntitlements.bind(entitlementInstance))
  .get(domainService.getDomainDashboard.bind(domainService));

loginRoute
  .post(loginService.authLogin.bind(loginService));

logoutRoute
  .post(logoutService.userLogout.bind(logoutService));

leadershipRoute
  .get(entitlementInstance.getLeaderAction.bind(entitlementInstance))
  .get(leadershipService.getLeadershipDashboard.bind(leadershipService));

drillRoute
  .get(entitlementInstance.getEntitlements.bind(entitlementInstance))
  .get(drillService.getDrillDashboard.bind(drillService));

customDrillRoute
  .get(drillService.getAllDrill.bind(drillService));

emailRoute
  .post(emailService.sendmail.bind(emailService));

filterEmailRoute
  .post(emailService.sendFilteredDataMail.bind(emailService));

pdfRoute
  .get(genericService.generateCSV.bind(genericService));

getAction
  .get(entitlementInstance.getLeaderAction.bind(entitlementInstance))
  .get(genericService.getAll.bind(genericService));

removeAction
  .post(entitlementInstance.getLeaderAction.bind(entitlementInstance))
  .post(genericService.deleteRecord.bind(genericService));

fhirValidateRoute
  .get(genericService.validateRecord.bind(genericService));

fhirValidateRoutemulti
  .post(genericService.validateRecordmulti.bind(genericService));

userAuditLogRoute
  .post(userAuditLogService.add.bind(userAuditLogService));

userAuditLogDownloadRoute
  .post(userAuditLogService.authenticateAuditLogs.bind(userAuditLogService))
  .post(userAuditLogService.getAuditLogs.bind(userAuditLogService));

resetpasswordRoute
  .post(resetPasswordService.requestchangePassword.bind(resetPasswordService));

validateuserTokenRoute
  .post(resetPasswordService.validateUserToken.bind(resetPasswordService));

changePasswordRoute
  .post(resetPasswordService.changePassword.bind(resetPasswordService));

export {router};

