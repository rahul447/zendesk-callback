"use strict";
import PDFDocument from "pdfmake/src/printer";
import ApiError from "../../util/apiError";
import fs from "fs";
import Q from "q";
import request from "request";
import json2csv from "json2csv";

let protectedGenericInstance,
  repoObj = {
    "collection": "",
    "filter": {},
    "projection": {}
  };

export class GenericService {

  constructor(genericRepo, loggerInstance, mongo, config) {
    GenericService.genericRepo = genericRepo;
    GenericService.loggerInstance = loggerInstance;
    GenericService.mongo = mongo;
    GenericService.config = config;
  }
  
  generatePDF(req) {
    GenericService.loggerInstance.info("=======Generating CSV==========>");
    let defer = Q.defer(),
      projection = `dashboard.${req.body.domain}.groups.portlets.drillDown.data`;

    repoObj.collection = "drilldown_data";
    repoObj.filter = {"_id": req.userId};
    repoObj._domain = req.body.domain;
    repoObj._group = req.body.groupId;
    repoObj._portlet = req.body.portletId;
    console.log(repoObj);

    GenericService.genericRepo.drillData(repoObj)
      .then(resp => {
        try {
          let content = resp.dashboard[req.body.domain].groups[0].portlets[0].drillDown.data,
            columnNames = Object.keys(content[0]),
            csv = json2csv({
              "data": content,
              "fields": columnNames
            });
  
          fs.writeFile("CSV/attachment.csv", csv, err => {
            if (err) {
              console.log("***Error on writing to csv****", err);
              defer.reject(new ApiError("Internal Server Error", ["Error genrating CSV"], err, 500))
            }else {
              console.log("CSV generated successfully");
              defer.resolve();
            }
          });
        }catch (exp) {
          console.log("*****Exception Thrown******", exp);
          defer.reject(exp);
        }
        /*Object.keys(content).map(key => {
>>>>>>> Stashed changes
          columnNames = Object.keys(content[key]);
          
          if (key <= 2000) {
            tableRowContent = this.generateValueOfObj(content[key]);
            docDefinition.content[1].table.body.push(tableRowContent);
          }
        });
        columnNames.shift();
        docDefinition.content[1].table.body.unshift(columnNames);
<<<<<<< Updated upstream
        // console.log(JSON.stringify(docDefinition));
        // fs.writeFile('data.json', JSON.stringify(docDefinition, null, 2) , 'utf-8');
        console.log("NOw writing to PDF=================>");
        let createStream = fs.createWriteStream("PDF/Attachment.pdf"),
          pdfDoc = printer.createPdfKitDocument(docDefinition);
        
<<<<<<< HEAD
        pdfDoc.pipe(createStream);
        pdfDoc.end();
        console.log("Pdf generated successfully");
=======
        /*pdfDoc.on("readable", () => {
          
        })*/

      }, err => {
        defer.reject(new ApiError("Internal Server Error", "DB error", err, 500));
      });

    return defer.promise;
  }

  generatePDFforFilteredData(req) {
    let printer = new PDFDocument(fonts),
      defer = Q.defer(),
      content, columnNames, tableRowContent,
      docDefinition = {
        "pageOrientation": "landscape",
        "content": [
          {
            "text": "Patient details", "style": "title"
          },
          {
            "style": "tableExample",
            "table": {
              "body": [
              ]
            },
            "layout": {
              hLineWidth(i, node) {
                return (i === 0 || i === node.table.body.length) ? 2 : 1;
              },
              vLineWidth(i, node) {
                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
              },
              hLineColor(i, node) {
                return (i === 0 || i === node.table.body.length) ? "black" : "gray";
              },
              vLineColor(i, node) {
                return (i === 0 || i === node.table.widths.length) ? "black" : "gray";
              }
            }
          }
        ],
        "styles": {
          "header": {
            "fontSize": 18,
            "bold": true,
            "margin": [0, 0, 0, 10]
          },
          "subheader": {
            "fontSize": 16,
            "bold": true,
            "margin": [0, 10, 0, 5]
          },
          "tableExample": {
            "margin": [0, 5, 0, 15]
          },
          "tableHeader": {
            "bold": true,
            "fontSize": 13,
            "color": "black"
          }
        },
        "defaultStyle": {
          // alignment: 'justify'
        }
      },
      pdfDoc;

    content = req.body.data;
    Object.keys(content).map(key => {
      columnNames = Object.keys(content[key]);
      tableRowContent = this.generateValueOfObj(content[key]);
      docDefinition.content[1].table.body.push(tableRowContent);
    });
    columnNames.shift();
    docDefinition.content[1].table.body.unshift(columnNames);
    console.log(JSON.stringify(docDefinition));
    pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream("CSV/Attachment.pdf"));
    console.log("Pdf generated successfully");
    pdfDoc.end();
    defer.resolve();
    return defer.promise;
  }

  generateValueOfObj(obj) {
    let valuesArr = [];

    Object.keys(obj).map(key => {
      if (!isNaN(obj[key])) {
        let numberToString = String(obj[key]);

        valuesArr.push(numberToString);
      }else {
        valuesArr.push(obj[key]);
      }
    });
    valuesArr.shift();
    return valuesArr;
  }

  getAll(req, res, next) {
    console.log("GenericService getAll call");
    GenericService.loggerInstance.info("GenericService getAll call");
    repoObj.collection = "actionables";
    repoObj.filter = {
      "_id": req.userId
    };
    repoObj.createdDate = 1;
    repoObj.limit = 5;
    GenericService.genericRepo.getData(repoObj)
      .then(resp => {
        GenericService.loggerInstance.info("GenericService success after retrieve call");
        res.status(200).send(resp);
      }, err => {
        this.loggerInstance.info("GenericService fail after retreive call");
        return next(new ApiError("Internal Server error", "DB error", err, 500));
      })
      .done();
  }

  deleteRecord(req, res, next) {
    GenericService.loggerInstance.info("GenericService delete record call");
    repoObj.collection = "actionables";
    repoObj.filter = {
      "id": req.body.col
    };
    repoObj.limit = 5;
    repoObj.id = req.params.id;
    GenericService.genericRepo.removeRecord(repoObj)
      .then(resp => {
        GenericService.loggerInstance.info("GenericService success after remove call");
        res.status(200).send(resp);
      }, err => {
        GenericService.loggerInstance.info("GenericService fail after remove call");
        return next(new ApiError("Internal Server error", "DB error", err, 500));
      });
  }

  validateRecord(req, res, next) {
    GenericService.loggerInstance.info("Generic schema validation");
    const url = `${
      GenericService.config.fhirValidator.baseURI.protocol
      }://${
      GenericService.config.fhirValidator.baseURI.domain
      }:${
      GenericService.config.fhirValidator.baseURI.port
      }/fhir/v1/focus/${
      req.params.endpoint
      }/${
      req.params.id
      }`,
      options = {
        "url": url,
        "headers": {
          "Content-Type": "application/json"
        }
      };

    request.get(options, (err, xhp, body) => {
      if (err) {
        GenericService.loggerInstance.debug("Error received:", err);
        return next(new ApiError("Internal Server error", "Error while validating fhir endpoint", err, 500));
      }

      let response = JSON.parse(body),
        result = {};

      if (req.params.endpoint === "Patient") {
        result.PatientID = response.identifier[0].value;
        result.PatientName = response.name[0].text;
        result.DOB = new Date(response.birthDate);
        result.PatientCity = response.address[0].city;
      } else if (req.params.endpoint === "Appointment") {
        result.VisitID = response.identifier[0].value;
        result.Description = response.description;
        result.Status = response.status;
        result.Comments = response.comment;
        result.DayofWeek = new Date(response.start);
      }
      GenericService.loggerInstance
        .debug("DONE: ", body);
      res.status(200).send(result);
    });

  }

  /* getUserPreference(req) {
    let projection = "dashboard.financial.groups.portlets.component.options";

    repoObj.collection = "preferences";
    repoObj.filter = {"_id": req.userId};
    repoObj.projection[projection] = 1;
    console.log(repoObj);

    return GenericService.genericRepo.retrieve(repoObj);
  } */
}

export function getGenericServiceInstance(...args) {

  protectedGenericInstance = protectedGenericInstance || new GenericService(...args);

  return protectedGenericInstance;
}
