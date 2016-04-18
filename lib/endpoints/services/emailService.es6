"use strict";

export class EmailService {

  constructor(loggerInstance, genericService, NodeMailer) {
    this.loggerInstance = loggerInstance;
    this.genericService = genericService;
    this.Nodemailer = NodeMailer;
  }
  sendmail(req, res) {
    let mailOption = {
      "to": req.body.to,
      "from": "info@cantahealth.com",
      "text": "Hello MDOffice",
      "html": "<footer>The data displayed in this email is a result of a drill down from a dashboard. Please do not " +
      "reply to this e-mail, as it was sent from an unattended e-mail address. For any query or clarification please " +
      "feel free to contact info@cantahealth.com</footer>",
      "attachments": [{
        "file": "testMail.pdf",
        "path": "PDF/testMail.pdf"
      }]
    };

    this.genericService.generatePDF(req, res)
      .then(() => {
        mailOption.subject = `Focus email for ${req.body.domain} drilldown for user ${req.body.emailId}`;
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
