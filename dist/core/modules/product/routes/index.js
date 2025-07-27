"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.route("/").post(controllers_1.addProduct);
router.route("/:id").get(controllers_1.getSingleProduct);
router.route("/").get(controllers_1.getAllProducts);
router.route("/:id").put(controllers_1.updateProduct);
router.route("/:id").delete(controllers_1.deleteSingleProduct);
exports.default = router;
