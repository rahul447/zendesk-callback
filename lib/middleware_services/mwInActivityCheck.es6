"use strict";
import ApiError from "../util/apiError";
import {RedisCache} from "ch-redis-cache";

function mwInActivityCheck(req, res, next) {
  let {NODE_ENV} = process.env,
    nodeEnv = NODE_ENV || "local",
    config = Object.freeze(require("../../config/" + nodeEnv)),
    redis = new RedisCache({"redisdb": {"host": config.caching.host,
      "port": config.caching.port, "ttl": config.caching.ttl, "db": 25}}),
    redisStore = {};

  if (config.publicUrls.indexOf(req.url) === -1) {
    redis.getToken({
      "key": req.user.userEmail
    })
    .then(token => {
      if (token) {
        let currentTime = Math.round(new Date().getTime() / 1000);

        redisStore.lastCheckIn = currentTime;
        redisStore.token = token;
        if ((currentTime - Number(token.lastCheckIn)) > 30) {
          return next(new ApiError("Internal Server Error", "Invalid token", "Session timeout", 401));
        }
        redis.setToken({
          "key": req.user.userEmail,
          "value": redisStore
        });
      }
      return next();
    }, err => {
      console.log("Redis server error ", err);
      return next(new ApiError("Internal Server Error", "Redis Server Error", "", 500));
    });
  }else {
    return next();
  }
}
export default mwInActivityCheck;
