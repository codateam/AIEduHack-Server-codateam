"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmailAndPassword = void 0;
const uuid_1 = require("uuid");
function generateEmailAndPassword() {
    const generatedUUID = (0, uuid_1.v4)();
    const email = `${generatedUUID}@example.com`;
    const password = generatedUUID.replace(/-/g, ""); // Removing dashes from UUID for password
    return { email, password };
}
exports.generateEmailAndPassword = generateEmailAndPassword;
