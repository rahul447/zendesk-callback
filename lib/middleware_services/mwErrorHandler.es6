"use strict";
function mwErrorHandler(err, req, res, next) {

  if (err) {
    if (err instanceof Error) {
      res.status(err.statusCode).send(err.messages);
    }else {
      res.status(500).send("Internal Server Error");
    }
  }
  next();
}

export default mwErrorHandler;
