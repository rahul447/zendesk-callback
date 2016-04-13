"use strict";
import PDFDocument from "pdfmake/src/printer";
import ApiError from "../../util/apiError";
import fs from "fs";
import Q from "q";
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
        "text": "Tables", "style": "title", "bold": true, "fontSize": 20, "margin": [0, 20, 0, 8]
      },
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
    let printer = new PDFDocument(fonts),
      defer = Q.defer(),
      projection = "dashboard.financial.groups.portlets.drillDown",
      content, columnNames, tableRowContent;

    repoObj.collection = "users";
    repoObj.filter = {"_id": req.userId};
    repoObj.projection[projection] = 1;
    console.log(repoObj);

    GenericService.genericRepo.retrieve(repoObj)
      .then(resp => {
        content = resp.dashboard.financial.groups[0].portlets[0].drillDown.data;
        docDefinition.content[0].text = resp.dashboard.financial.groups[0].portlets[0].drillDown.title;

        Object.keys(content).map(key => {
          columnNames = Object.keys(content[key]);
          tableRowContent = this.generateValueOfObj(content[key]);
          docDefinition.content[1].table.body.push(tableRowContent);
        });
        columnNames.shift();
        docDefinition.content[1].table.body.unshift(columnNames);
        console.log(JSON.stringify(docDefinition));
        let pdfDoc = printer.createPdfKitDocument(docDefinition);

        pdfDoc.pipe(fs.createWriteStream("PDF/tabs.pdf"));
        pdfDoc.end();

        console.log("Pdf generated successfully");
        defer.resolve(res);
      }, err => {
        defer.reject(new ApiError(err, "Database error"));
      });

    return defer.promise;
  }

  generateValueOfObj(obj) {
    let valuesArr = [];

    Object.keys(obj).map(key => {
      valuesArr.push(obj[key]);
    });
    valuesArr.shift();
    return valuesArr;
  }
}

export function getGenericServiceInstance(...args) {

  protectedGenericInstance = protectedGenericInstance || new GenericService(...args);

  return protectedGenericInstance;
}
