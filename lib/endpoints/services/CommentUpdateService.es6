"use strict";

export class CommentUpdateService {
  constructor(config, firebaseServiceObject) {
    this.config = config;
    this.firebaseServiceObject = firebaseServiceObject;
    this.triggerType = "ticketComment";
  }

  extractTicketId(req, res) {

    let ticketId = req.query[this.triggerType];

    this.pushCount(ticketId)
    .then(data => res.send(data))
    .catch(err => res.send(err));
  }

    pushCount(ticketId) {
    return new Promise((resolve, reject) => {
        this.firebaseServiceObject.pushToFirebase(this.triggerType, ticketId)
        .then(() => {
            resolve("Success");
        })
        .catch(err => {
            reject(err);
        });
    });
  }
}

