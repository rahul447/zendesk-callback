"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _CommentUpdateService = require("./services/CommentUpdateService");

var _firebaseService = require("./services/firebaseService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(),
    NODE_ENV = process.env.NODE_ENV,
    nodeEnv = NODE_ENV || "local",
    config = Object.freeze(require("../../config/" + nodeEnv)),
    testCallback = router.route("/testCallback"),
    firebaseServiceObject = new _firebaseService.firebaseService(config),
    CommentUpdateServiceObject = new _CommentUpdateService.CommentUpdateService(config, firebaseServiceObject);


testCallback.get(CommentUpdateServiceObject.extractTicketId.bind(CommentUpdateServiceObject));

exports.router = router;
//# sourceMappingURL=index.js.map
