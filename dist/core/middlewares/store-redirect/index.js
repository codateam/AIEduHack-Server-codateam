"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRedirectToInSession = void 0;
const url_1 = __importDefault(require("url"));
const storeRedirectToInSession = (req, res, next) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const urlParts = url_1.default.parse(req.get("referer"));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const redirectTo = urlParts.pathname;
    // req.session.redirectTo = redirectTo;
    next();
};
exports.storeRedirectToInSession = storeRedirectToInSession;
