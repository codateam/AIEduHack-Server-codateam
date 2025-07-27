"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    middleName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    matricNo: {
        type: String,
        // unique: true,
        default: "",
        // require: true,
    },
    password: {
        type: String,
        default: "",
    },
    profilepics: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["admin", "lecturer", "student"],
        default: "student",
    },
    userToken: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, rec) {
            rec.id = rec._id;
            delete rec.__v;
            delete rec._id;
            delete rec.salt;
            delete rec.hash;
            // delete rec.pass
        },
    },
});
userSchema.pre("save", async function (next) {
    if (this.password) {
        this.password = await bcrypt_1.default.hash(this.password, 12);
    }
    next();
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
