"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const marketSchema = new mongoose_1.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    location: {
        type: String,
        default: "",
    },
    opening: {
        type: String,
        default: "",
    },
});
