"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.router = undefined;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _CommentUpdateService = require("./services/CommentUpdateService");

var _NewTicketService = require("./services/NewTicketService");

var _firebaseService = require("./services/firebaseService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(),
    NODE_ENV = process.env.NODE_ENV,
    nodeEnv = NODE_ENV || "local",
    config = Object.freeze(require("../../config/" + nodeEnv)),
    commentsCallback = router.route("/" + config.firebaseDbKeys.Comments),
    newTicketCallback = router.route("/" + config.firebaseDbKeys.NewTicket),
    firebaseServiceObject = new _firebaseService.firebaseService(config),
    CommentUpdateServiceObject = new _CommentUpdateService.CommentUpdateService(config, firebaseServiceObject),
    NewTicketServiceObject = new _NewTicketService.NewTicketService(config, firebaseServiceObject);


commentsCallback.get(CommentUpdateServiceObject.extractTicketId.bind(CommentUpdateServiceObject));

newTicketCallback.get(NewTicketServiceObject.trackNewTicket.bind(NewTicketServiceObject));

exports.router = router;
//# sourceMappingURL=index.js.map
