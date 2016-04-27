"use strict";
function mwErrorHandler(err, req, res, next) {
  if (err) {
    if (err.domain) {
      console.log("Something Bad Happened", err);
      // you should think about gracefully stopping & respawning your server
      // since an unhandled error might put your application into an unknown state
    }
    if (err.statusCode && err.messages) {
      res.status(err.statusCode).send(err.messages);
    }else {
      res.status(500).send("Internal Server Error");
    }
  }
  next();
}

export default mwErrorHandler;
