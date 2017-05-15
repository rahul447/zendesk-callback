"use strict";
import ApiError from "../../util/apiError";
import jwt from "jsonwebtoken";
import Q from "q";

export class testService {
  constructor(config) {
    this.config = config;
  }

  testCallback(req, res, next) {
    console.log("TEST SUCCESSFUL");
    console.log("req ", req);
    console.log("res ", res);
    res.send("xoxo");
  }
}

