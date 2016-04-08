/*
"use strict";

import phantom from "phantom";
import tempFile from "../../../views/index.jade";


class exportToPdf {

  constructor() {
    phantom.create()
      .then(instance => {
        const phInstance = instance;
        return instance.createPage();
      })
      .then(page => {
        const sitepage = page;
        return page.render(tempFile);
      });
  }
}

export default exportToPdf;

*/
