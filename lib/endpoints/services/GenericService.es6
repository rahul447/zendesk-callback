"use strict";
let protectedGenericInstance;

export class GenericService {

  constructor({genericRepo, loggerInstance, mongo}) {
    GenericService.genericRepo = genericRepo;
    GenericService.loggerInstance = loggerInstance;
    GenericService.mongo = mongo;
  }
}

export function getGenericServiceInstance(...args) {
  protectedGenericInstance = protectedGenericInstance || new GenericService(...args);

  return protectedGenericInstance;
}
