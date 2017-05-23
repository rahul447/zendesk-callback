"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _ticketService = require("./services/ticketService");

var _firebaseService = require("./services/firebaseService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(),
    NODE_ENV = process.env.NODE_ENV,
    nodeEnv = NODE_ENV || "local",
    config = Object.freeze(require("../../config/" + nodeEnv)),
    zendeskCallback = router.route("/"),
    firebaseServiceObject = new _firebaseService.firebaseService(config),
    ticketServiceObject = new _ticketService.ticketService(config, firebaseServiceObject);


zendeskCallback.get(ticketServiceObject.getRequestType.bind(ticketServiceObject));

exports.router = router;
//# sourceMappingURL=index.js.map
