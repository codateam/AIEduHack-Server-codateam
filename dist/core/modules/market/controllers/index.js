"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarketId = exports.deleteMarketId = exports.getAllMarkets = exports.getMarketId = exports.createMarket = void 0;
const async_handler_1 = require("../../../../utils/async-handler");
const market_1 = __importDefault(require("../models/market"));
exports.createMarket = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
        name: req.body.name,
        location: req.body.location,
        opening: req.body.opening,
        cordinates: req.body.cordinates,
    };
    const newMarkety = await market_1.default.create(payload);
    res.status(201).json({
        message: "Successfully create market",
        data: newMarkety,
    });
});
exports.getMarketId = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const market = await market_1.default.findById(id);
    res.status(200).json({
        message: "Retrieve data successfully",
        data: market,
    });
});
exports.getAllMarkets = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const markets = await market_1.default.find();
    res.status(200).json({
        message: "Retrieves data successfully",
        data: markets,
    });
});
exports.deleteMarketId = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const deleteMarket = await market_1.default.findByIdAndDelete(id);
    res.status(200).json({
        message: "Deleted data successfully",
        data: deleteMarket,
    });
});
exports.updateMarketId = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
        name: req.body.name,
        location: req.body.location,
        opening: req.body.opening,
        cordinates: req.body.cordinates,
    };
    let doc = await market_1.default.findById(id);
    for (let value in doc) {
        if (payload[value]) {
            // console.log((doc[value], payload[value]));
            doc[value] = payload[value];
        }
    }
    const updateData = await doc.save();
    res.status(200).json({
        message: "Updated data successfully",
        data: updateData,
    });
});
