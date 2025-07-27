"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
// validate([body("name"), body("location"), body("opening"), body("cordinates")]);
router.route("/").post(
// validate([
//   body("name").notEmpty().trim().toString(),
//   // body("location").notEmpty(),
//   body("opening").notEmpty(),
//   body("cordinates").notEmpty().isArray(),
// ]),
controllers_1.createMarket);
router.route("/").get(controllers_1.getAllMarkets);
router.route("/:id").get(controllers_1.getMarketId);
router.route("/:id").delete(controllers_1.deleteMarketId);
router.route("/:id").put(controllers_1.updateMarketId);
// router.route("/", validate)
exports.default = router;
