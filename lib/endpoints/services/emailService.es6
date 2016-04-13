"use strict";

export class EmailService {

  constructor(loggerInstance, genericService, NodeMailer) {
    this.loggerInstance = loggerInstance;
    this.genericService = genericService;
    this.Nodemailer = NodeMailer;
  }
  sendmail(req, res) {
    let mailOption = {
      "to": "shaileshs@cantahealth.com",
      "from": "mdoffice@cantahealth.com",
      "subject": "First Mail with attachement",
      "text": "Hello MDOffice",
      "html": "<h1>CantaHealth Test Mail</h1>",
      "attachments": [{
        "file": "tabs.pdf",
        "path": "PDF/tabs.pdf"
      }]
    };

    this.genericService.generatePDF(req, res)
      .then(() => {
        this.Nodemailer.send(mailOption)
          .then(resp => {
            console.log("Mail sent Successfully");
            res.status(200).send(resp);
          }, err => {
            console.log("Mail not sent", err);
            res.send(500).send(err);
          });
      }, err => {
        console.log("Error generating pdf");
        res.status(500).send(err);
      });
  }
}
