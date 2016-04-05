"use strict";

import Q from "q";

let protectedGenericRepoInstance;

export class GenericRepository {

  constructor({
    config,
    mongodb,
    loggerInstance
    }) {
    console.log(config);
    console.log(mongodb);
    console.log(loggerInstance);
    if (!config ||
      !config.mongoDb ||
      !config.mongoDb.connectionString ||
      !config.mongoDb.operationTimeout ||
      !config.mongoDb.connectionOptions ||
      !config.mongoDb.promiseTimeout ||
      !loggerInstance
    ) {
      throw new Error("Failed to initialise MongoDB, config or dependencies were missing");
    }

    console.log("inside generic repo ctor");

    this.loggerInstance = loggerInstance;

    /** @member {string} Connection string to database. */
    this.connectionString_ = config.mongoDb.connectionString;

    /** @member {Object} Options object to pass to the driver connect method. */
    this.connectionOptions_ = config.mongoDb.connectionOptions;

    /** @member {Object} The default write concern for CUD operations. */
    this.commonWriteConcern_ = {
      "wtimeout": config.mongoDb.operationTimeout,
      "j": true,
      "w": "majority"
    };

    /** @member {number} The default timeout for promises in ms */
    this.promiseTimeout_ = config.mongoDb.promiseTimeout;

    /** @static {Function} Connect method */
    GenericRepository.nativeConnect = mongodb.MongoClient.connect;

    /** @member {Q.Promise} Promise which represents the db connection and resolves to the db controller object. */
    this.db_ = this.connectToDb_();
  }

  /**
   * Creates a connection to the database.
   * @private
   * @returns {Q.Promise} A promise which resolves to the database controller object.
   */
  connectToDb_() {

    this.loggerInstance.info("Connecting to db with options: ", this.connectionOptions_);

    this.db_ = Q.ninvoke(GenericRepository, "nativeConnect", this.connectionString_, this.connectionOptions_);

    return this.db_;
  }

  static idSwap(obj) {

    let swappedObj = Object.create(Reflect.getPrototypeOf(obj));

    /* eslint-disable prefer-reflect */
    for (let propKey of Object.getOwnPropertyNames(obj)) {
      /* eslint-enable prefer-reflect */

      let descriptor = Reflect.getOwnPropertyDescriptor(obj, propKey);

      switch (propKey) {
        case "id":
          Reflect.defineProperty(swappedObj, "_id", descriptor);
          break;
        case "_id":
          Reflect.defineProperty(swappedObj, "id", descriptor);
          break;
        default:
          Reflect.defineProperty(swappedObj, propKey, descriptor);
      }
    }

    return swappedObj;
  }

  /**
   * Get the event resource relation from event resource map
   * @param {string} event Name of the event
   * @returns {Object} the relation from the event resource map
   */
  getEventResourceRelation(event) {
    return this.eventResourceMap_.get(
      GenericRepository
        .eventRegistry
        .lookupForEventContainer(event)
    );
  }

  create({
    entity, event
    }) {

    this.loggerInstance.info("Writing entity to db: ", entity);

    return this.db_
      .catch(err => {
        this.loggerInstance.debug("Connection to db is broken at create: ", err);
        return this.connectToDb_();
      })
      .then(db => {

        let collName = this.getEventResourceRelation(event).collection;

        return Q.ninvoke(
          db.collection(collName),
          "insertOne", GenericRepository.idSwap(entity),
          this.commonWriteConcern_
        );
      })
      .timeout(this.promiseTimeout_)
      .then(writeResult => {

        /* console.log(
         "Writeresult for insert record: ",
         {"entity": entity, "writeResult": writeResult}
         ); */

        if (writeResult.result.n === 0) {

          let err = new Error("Nothing is inserted in db");

          this.loggerInstance.debug("Nothing is inserted in db when trying to create entity: ", entity);
          throw err;
        }

        return writeResult.result.n;
      });
  }

  update() {

  }

  retrieve(param) {

    console.log("inside retrieve");

    this.loggerInstance.info("Retreiving from db");
    let {collection, filter, projection} = param;

    return this.db_
      .catch(err => {
        this.loggerInstance.debug("Connection to db is broken at create: ", err);
        return this.connectToDb_();
      })
      .then(db => {
        this.loggerInstance.debug("Successfully connected");
        //     let collName = this.getEventResourceRelation(event).collection;
        // let collName = "users";
        console.log("calling query");
        return Q.ninvoke(
          db.collection(collection),
          "findOne", filter, projection
        );
      })
      .then(findResult => {
        this.loggerInstance.debug("Find success", findResult);
        return findResult;
      });
  }
}

export function getGenericRepoInstance(args) {
  console.log(protectedGenericRepoInstance);
  protectedGenericRepoInstance = protectedGenericRepoInstance || new GenericRepository(args);
  return protectedGenericRepoInstance;
}
