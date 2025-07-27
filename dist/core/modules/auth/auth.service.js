"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByRole = exports.createUser = exports.loginWithEmailAndPassword = exports.findUserById = exports.findUser = void 0;
const auth_model_1 = __importDefault(require("./auth.model"));
const bcrypt = __importStar(require("bcrypt"));
const findUser = async (email) => {
    const isUser = await auth_model_1.default.findOne({ email: email });
    return isUser;
};
exports.findUser = findUser;
const findUserById = async (id) => {
    const isUser = await auth_model_1.default.findById(id).select("-password");
    return isUser;
};
exports.findUserById = findUserById;
const loginWithEmailAndPassword = async (email, password) => {
    const user = await auth_model_1.default.findOne({ email: email });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
        throw new Error("Invalid email or password");
    }
    user.password = "";
    return user;
};
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
const createUser = async (userData) => {
    const isUser = await (0, exports.findUser)(userData.email);
    if (isUser) {
        throw new Error("user already exist");
    }
    const user = await auth_model_1.default.create(userData);
    return user;
};
exports.createUser = createUser;
const getUsersByRole = async (role, page = 1, limit = 10, search = "") => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        auth_model_1.default.find({
            role: role,
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { middleName: { $regex: search, $options: "i" } },
                { matricNo: { $regex: search, $options: "i" } },
            ],
        })
            .select("-password")
            .limit(limit)
            .skip(skip),
        auth_model_1.default.countDocuments({
            role: role,
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { middleName: { $regex: search, $options: "i" } },
                { matricNo: { $regex: search, $options: "i" } },
            ],
        }),
    ]);
    return {
        users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1,
        },
    };
};
exports.getUsersByRole = getUsersByRole;
