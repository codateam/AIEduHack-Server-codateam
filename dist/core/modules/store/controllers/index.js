"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStore = exports.updateStore = exports.getAllStores = exports.getSingleStore = exports.createStore = void 0;
const async_handler_1 = require("../../../../utils/async-handler");
const store_1 = __importDefault(require("../models/store"));
exports.createStore = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const payload = {
        username: req.body.username,
        brandName: req.body.brandName,
        location: req.body.location,
        opening: req.body.opening,
        userId: req.body.userId,
        marketId: req.body.marketId,
    };
    const newStore = await store_1.default.create(payload);
    res.status(200).json({
        message: "Create store successfully",
        data: newStore,
    });
});
exports.getSingleStore = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const store = await store_1.default.findById(id);
    res.status(200).json({
        message: "Retrieve store successfully",
        data: store,
    });
});
exports.getAllStores = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const stores = await store_1.default.find();
    res.status(200).json({
        message: "Retrieve all stores successfully",
        data: stores,
    });
});
exports.updateStore = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
        username: req.body.username,
        brandName: req.body.brandName,
        location: req.body.location,
        opening: req.body.opening,
        userId: req.body.userId,
        marketId: req.body.marketId,
    };
    const doc = await store_1.default.findById(id);
    for (let value in doc) {
        if (payload[value]) {
            doc[value] = payload[value];
        }
    }
    const updatedStore = await doc.save();
    res.status(200).json({
        message: "Updated store successfully",
        data: updatedStore,
    });
});
exports.deleteStore = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const stores = await store_1.default.findByIdAndDelete(id);
    res.status(200).json({
        message: "Deleted store successfully",
        data: { storeId: id },
    });
});
