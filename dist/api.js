"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mwAllowCrossDomain = require("./middleware_services/mwAllowCrossDomain");

var _mwAllowCrossDomain2 = _interopRequireDefault(_mwAllowCrossDomain);

var _index = require("./endpoints/index");

var _expressDomainMiddleware = require("express-domain-middleware");

var _expressDomainMiddleware2 = _interopRequireDefault(_expressDomainMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NODE_ENV = process.env.NODE_ENV,
    nodeEnv = NODE_ENV || "local",
    config = Object.freeze(require("../config/" + nodeEnv)),
    app = (0, _express2.default)(),
    urlPrefix = config.urlPrefix,
    environmentVariables = require("../config/environmentVariables");

// Sets the relevant config app-wise
app.use(_expressDomainMiddleware2.default);
app.set("port", config.http.port);
app.set("domain", config.http.domain);
app.use(_mwAllowCrossDomain2.default);
app.use(_bodyParser2.default.json());

app.use("" + urlPrefix, _index.router);

// Starts the app
app.listen(app.get("port"), app.get("domain"), function () {
  console.log("Server has started and is listening on port: " + app.get("port") + " and ip : " + app.get("domain"));
});
//# sourceMappingURL=api.js.map
