"use strict";
import firebase from "firebase";

export class firebaseService {

    constructor(config) {
        this.config = config;
        this.firebaseObject = firebase;
        this.firebaseObject.initializeApp(this.config.firebaseDetails);
        this.firebaseDatabaseObject = this.firebaseObject.database();
    }

    pushToFirebase(triggerType, ticketId) {

        return new Promise((resolve, reject) => {

            this.firebaseDatabaseObject.ref().child(triggerType + "/" + ticketId).once("value")
            .then((data) => {
                if (data.val()) {
                    this.firebaseDatabaseObject.ref(triggerType + "/" + ticketId)
                    .set(data.val() + 1);
                }else {
                    this.firebaseDatabaseObject.ref(triggerType + "/" + ticketId)
                    .set(1);
                }
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }

    removeFromFirebase(key, ticketId) {
        return new Promise((resolve) => {
            this.firebaseDatabaseObject.ref(key + "/" + ticketId).remove();
            resolve();
        });
    }
}

