"use strict";

export class ticketService {
    constructor(config, firebaseServiceObject) {
        this.config = config;
        this.firebaseServiceObject = firebaseServiceObject;
    }

    getRequestType(req, res) {

        if (req.query.ticketComment) {
            this.triggerType = "ticketComment";
        }else if (req.query.newTicket) {
            this.triggerType = "newTicket";
        }else if (req.query.ticketSolved) {
            this.triggerType = "ticketSolved";
        }

        this.extractTicketId(req, res);
    }

    extractTicketId(req, res) {

        let ticketId = req.query[this.triggerType];

        if (this.triggerType !== "ticketSolved") {
            this.pushCount(ticketId)
            .then(data => res.send(data))
            .catch(err => res.send(err));
        }else {
            this.removeCount(ticketId)
            .then(data => res.send(data))
            .catch(err => res.send(err));
        }

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

    removeCount(ticketId) {
        return new Promise((resolve, reject) => {
            this.firebaseServiceObject.removeFromFirebase("ticketComment", ticketId)
            .then(() => {
                this.firebaseServiceObject.removeFromFirebase("newTicket", ticketId)
                .then(() => {
                    resolve("Success");
                });
            })
            .catch(err => {
                reject(err);
            });
        });
    }
}

