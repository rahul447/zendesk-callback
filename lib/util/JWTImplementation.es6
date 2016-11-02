"use strict";

import jsonwebtoken from "jsonwebtoken";
import Q from "q";

class JWTImplementaion {

    sign(payload, secretKey, options) {

        let signedData = jsonwebtoken.sign(payload, secretKey, options);

        return signedData;
    }

    verifyData(data, secretKey, options = {}) {
        return Q.ninvoke(jsonwebtoken, "verify", data, secretKey, options);
    }
}

export default JWTImplementaion;