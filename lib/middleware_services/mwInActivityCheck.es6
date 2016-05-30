"use strict";
import ApiError from "../util/apiError";
import moment from "moment";
import {RedisCache} from "ch-redis-cache";
import loggerInstance from "../util/FocusApiLogger";

function mwInActivityCheck(req, res, next) {
  let {NODE_ENV} = process.env,
    nodeEnv = NODE_ENV || "local",
    config = Object.freeze(require("../../config/" + nodeEnv)),
    redis = new RedisCache({"redisdb": config.caching, "logger": loggerInstance}),
    redisStore = {};

  if (req.user) {
    req.userId = req.user.userId;
  }

  if (config.publicUrls.indexOf(req.url) === -1) {
    redis.getToken({
      "key": req.user.userEmail
    })
    .then(user => {
      if (user) {
        let currentTime = moment().unix(); // Math.round(new Date().getTime() / 1000);

        redisStore.lastCheckIn = currentTime;
        redisStore.token = user.token;
        if ((currentTime - Number(user.lastCheckIn)) > config.MaxInactivityTime) {
          redis.deleteKey(req.user.userEmail)
            .then(success => {
              console.log("======User logged out successfully===>", success);
              return next(new ApiError("Unauthorized", "Invalid token", "Session timeout", 401));
            }, err => {
              loggerInstance.debug("===Error while logging out=>", err);
              return next(new ApiError("Internal Server Error", "Redis Server Error", err, 500));
            });
          return;
        }
        redis.setToken({
          "key": req.user.userEmail,
          "value": redisStore,
          "options": {
            "ttl": config.tokenExpireIn
          }
        })
          .then(() => {
            console.log("Time updated in token");
            return next();
          }, tokenNotSet => {
            console.log("Time not updated in token", tokenNotSet);
            return next(new ApiError("Internal Server Error", "Redis Server Error", tokenNotSet, 500));
          });
      }else {
        return next(new ApiError("Unauthorized", "User not logged in", "", 401));
      }
    }, err => {
      console.log("Redis server error ", err);
      return next(new ApiError("Internal Server Error", "Redis Server Error", "", 500));
    });
  }else {
    return next();
  }
}
export default mwInActivityCheck;
