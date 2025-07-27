"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSingleProduct = exports.updateProduct = exports.getAllProducts = exports.getSingleProduct = exports.addProduct = void 0;
const async_handler_1 = require("../../../../utils/async-handler");
const product_1 = __importDefault(require("../models/product"));
exports.addProduct = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const newProduct = await product_1.default.create(req.body);
    res.status(200).json({
        message: "Successfully created product",
        data: newProduct,
    });
});
exports.getSingleProduct = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const product = await product_1.default.findById(id);
    res.status(200).json({
        message: "Successfully retrieved product",
        data: product,
    });
});
exports.getAllProducts = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const products = await product_1.default.find();
    res.status(200).json({
        message: "Successfully retrieved product",
        data: products,
    });
});
exports.updateProduct = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        storeId: req.body.storeId,
        marketId: req.body.marketId,
        userId: req.body.userId,
    };
    let doc = await product_1.default.findById(id);
    for (let value in doc) {
        if (payload[value]) {
            doc[value] = payload[value];
        }
    }
    const updatedProduct = await doc.save();
    res.status(200).json({
        message: "Successfully updated product",
        data: updatedProduct,
    });
});
exports.deleteSingleProduct = (0, async_handler_1.asyncHandler)(async (req, res, next) => {
    const id = req.params.id;
    const products = await product_1.default.findByIdAndDelete(id);
    res.status(200).json({
        message: "Successfully Deleted product",
    });
});
