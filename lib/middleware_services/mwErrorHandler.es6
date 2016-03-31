"use strict";

function mwErrorHandler(err, req, res, next) {

  if (err) {
    res.status(500).send("Internal Server Error");
  }
  next();
}

export default mwErrorHandler;
