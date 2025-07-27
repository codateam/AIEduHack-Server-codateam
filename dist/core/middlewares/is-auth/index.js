"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const token_service_1 = require("../../modules/auth/token.service");
const isAuth = (req, res, next) => {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.get("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    const isAuthenticatedUser = (0, token_service_1.verifyToken)(token);
    if (isAuthenticatedUser != null) {
        next();
    }
    else {
        throw new Error("Unauthorized user");
    }
};
exports.isAuth = isAuth;
