"use strict";
function mwErrorHandler(err, req, res, next) {

  if (err) {
    if (err instanceof Error) {
      res.status(err.statusCode).send(err.messages);
    }else {
      res.status(500).send("Internal Server Error");
      if (err.domain) {
        console.log("DOMAIN ERROR");
        // you should think about gracefully stopping & respawning your server
        // since an unhandled error might put your application into an unknown state
      }
    }
  }
  next();
}

export default mwErrorHandler;
