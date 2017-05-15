"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _testService = require("./services/testService");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(),
    NODE_ENV = process.env.NODE_ENV,
    nodeEnv = NODE_ENV || "local",
    config = Object.freeze(require("../../config/" + nodeEnv)),
    testCallback = router.route("/testCallback"),
    test = new _testService.testService(config);


testCallback.get(test.testCallback.bind(test));

exports.router = router;
//# sourceMappingURL=index.js.map
