"use strict";
import ApiError from "../../util/apiError";

export class EmailService {

  constructor(loggerInstance, genericService, NodeMailer, config) {
    this.loggerInstance = loggerInstance;
    this.genericService = genericService;
    this.Nodemailer = NodeMailer;
    this.config = config;
  }
  sendmail(req, res, next) {
    this.loggerInstance.info(`$$$ ${EmailService.name} sendmail() =>`);
    let mailOption = {
      "to": req.body.to,
      "from": this.config.smtp.auth.user,
      "text": "Hello",
      "html": `<footer>
      The data displayed in this email is the result of drill down from ${req.body.domain} dashboard.Please do not reply
       to this e-mail, as it was sent from an unattended e-mail address. For any query or clarification please feel free
        to contact ${this.config.smtp.auth.user}</footer>`,
      "attachments": [{
        "file": "attachment.csv",
        "path": "CSV/attachment.csv"
      }]
    };

    this.loggerInstance.info(`$$$ ${EmailService.name} Now Generate CSV() =>`);
    this.genericService.generateCSV(req)
      .then(() => {
        this.loggerInstance.debug(`$$$ ${EmailService.name} generate CSV() Promise success`);
        mailOption.subject = `Focus email for ${req.body.domain} drilldown for user ${req.body.emailId}`;
        this.Nodemailer.send(mailOption)
          .then(resp => {
            this.loggerInstance.debug("Mail sent Successfully");
            res.status(200).send(resp);
          }, err => {
            this.loggerInstance.debug("Mail can't be sent due to Error =>", err);
            return next(new ApiError("Internal Server Error", "Mail failure", err, 500));
          });
      }, err => {
        this.loggerInstance.debug("Error generating CSV => ", err);
        return next(new ApiError("Internal Server Error", "Error generating CSV", err, 500));
      });
  }

  sendFilteredDataMail(req, res, next) {
    this.loggerInstance.info(`$$$ ${EmailService.name} sendFilteredDataMail() =>`);
    let mailOption = {
      "to": req.body.to,
      "from": this.config.smtp.auth.user,
      "text": "Hello",
      "html": `<footer>
      The data displayed in this email is the result of drill down from ${req.body.domain} dashboard.Please do not reply
       to this e-mail, as it was sent from an unattended e-mail address. For any query or clarification please feel free
        to contact ${this.config.smtp.auth.user}</footer>`,
      "attachments": [{
        "file": "Attachment.pdf",
        "path": "PDF/Attachment.pdf"
      }]
    };

    this.loggerInstance.info(`$$$ ${EmailService.name} Now Generate Filtered PDF() =>`);
    return this.genericService.generatePDFforFilteredData(req)
      .then(() => {
        this.loggerInstance.debug(`$$$ ${EmailService.name} generate PDF() Promise success`);
        mailOption.subject = `Focus email for ${req.body.domain} drilldown for user ${req.body.emailId}`;
        return this.Nodemailer.send(mailOption)
          .then(resp => {
            this.loggerInstance.debug("Mail sent Successfully");
            res.status(200).send(resp);
          }, err => {
            this.loggerInstance.debug("Mail can't be sent due to Error =>", err);
            return next(new ApiError("Internal Server Error", "Mail failure", err, 500));
          });
      }, err => {
        this.loggerInstance.debug("Error generating CSV => ", err);
        return next(new ApiError("Internal Server Error", "Error generating pdf", err, 500));
      });
  }
}
