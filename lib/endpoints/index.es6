"use strict";

import express from "express";
import {DomainService} from "./services/domainService";

let router = express.Router(),
  domainRoute = router.route("/domain/:name");
// domainPortletRoute = router.route("/domain/:name/:groupId/:portletId"),
// leadershipRoute = router.route("/leadership"),
// leadershipActionableRoute = router.route("/actionable/:id"),
// loginRoute = router.route("/login");

domainRoute
  .get(DomainService.getDashboard.bind(DomainService));

export {router};
