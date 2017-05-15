"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _apiError = require("../../util/apiError");

var _apiError2 = _interopRequireDefault(_apiError);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _q = require("q");

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var testService = exports.testService = function () {
  function testService(config) {
    _classCallCheck(this, testService);

    this.config = config;
  }

  _createClass(testService, [{
    key: "testCallback",
    value: function testCallback(req, res, next) {
      console.log("TEST SUCCESSFUL");
      console.log("req ", req);
      console.log("res ", res);
      res.send("xoxo");
    }
  }]);

  return testService;
}();
//# sourceMappingURL=testService.js.map
