"use strict";
import ApiError from "../util/apiError";

function mwErrorHandler(err, req, res, next) {
  if (err) {
    if (err.domain) {
      console.log("Something Bad Happened", err.stack);
      // you should think about gracefully stopping & respawning your server
      // since an unhandled error might put your application into an unknown state
    }
    if (err instanceof ApiError) {
      res.status(err.statusCode).send(err);
    }else if (err instanceof Error) {
      res.status(500).send("Internal Server Error");
    }
  }
  next();
}

export default mwErrorHandler;
