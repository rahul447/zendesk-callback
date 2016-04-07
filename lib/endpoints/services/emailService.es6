"use strict";

export class EmailService {

  constructor(loggerInstance) {
    this.loggerInstance = loggerInstance;
  }
  sendmail(req, res) {
    res.send("Sending mail");
  }
}
