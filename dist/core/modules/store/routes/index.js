"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.route("/").post(controllers_1.createStore);
router.route("/").get(controllers_1.getAllStores);
router.route("/:id").get(controllers_1.getSingleStore);
router.route("/:id").put(controllers_1.updateStore);
router.route("/:id").delete(controllers_1.deleteStore);
exports.default = router;
