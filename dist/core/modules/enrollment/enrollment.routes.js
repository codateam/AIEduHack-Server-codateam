"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("./enrollment.controller");
const verifyToken_1 = require("../../../utils/verifyToken/verifyToken");
const router = express_1.default.Router();
router
    .route("/")
    .post(verifyToken_1.verifyUser, enrollment_controller_1.enrollStudent)
    .get(verifyToken_1.verifyUser, enrollment_controller_1.getEnrollments);
router
    .route("/:id")
    .put(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, enrollment_controller_1.updateEnrollment)
    .delete(verifyToken_1.verifyUser, verifyToken_1.verifyLecturer, enrollment_controller_1.dropEnrollment);
exports.default = router;
