"use strict";
import PDFDocument from "pdfmake/src/printer";
import ApiError from "../../util/apiError";
import fs from "fs";
let protectedGenericInstance,
  fonts = {
    "Roboto": {
      "normal": "fonts/Roboto-Regular.ttf",
      "bold": "fonts/Roboto-Medium.ttf",
      "italics": "fonts/Roboto-Italic.ttf",
      "bolditalics": "fonts/Roboto-Italic.ttf"
    }
  },
  docDefinition = {
    "content": [
      {
        "style": "tableExample",
        "table": {
          "body": [

          ]
        }
      }
    ]
  },
  repoObj = {
    "collection": "",
    "filter": {},
    "projection": {}
  };

export class GenericService {

  constructor(genericRepo, loggerInstance, mongo) {
    GenericService.genericRepo = genericRepo;
    GenericService.loggerInstance = loggerInstance;
    GenericService.mongo = mongo;
  }

  generatePDF(req, res) {
    console.log("=======PDF======================");
    let printer = new PDFDocument(fonts),
      projection = "dashboard.financial.groups.portlets.drillDown",
      content;

    repoObj.collection = "users";
    repoObj.filter = {"_id": req.userId};
    repoObj.projection[projection] = 1;
    console.log(repoObj);

    GenericService.genericRepo.retrieve(repoObj)
      .then(resp => {
        console.log("================================");
        content = resp.dashboard.financial.groups[0].portlets[0].drillDown.data;
        console.log(content);

        content.forEach(val => {
          docDefinition.content[0].body.push(Object.keys(val));
          docDefinition.content[0].body.push(Object.keys(val).map(key => {
            return val[key];
          }));
        });
        console.log(docDefinition);

        let pdfDoc = printer.createPdfKitDocument(docDefinition);

        pdfDoc.pipe(fs.createWriteStream("PDF/tabs.pdf"));
        pdfDoc.end();

      }, err => {
        res.status(500).send(new ApiError(err, "Database error"));
      });
  }
}

export function getGenericServiceInstance(...args) {

  protectedGenericInstance = protectedGenericInstance || new GenericService(...args);

  return protectedGenericInstance;
}
