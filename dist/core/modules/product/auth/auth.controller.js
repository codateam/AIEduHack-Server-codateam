"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithEmailAndPassword = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const passport_1 = __importDefault(require("passport"));
const token_service_1 = require("./token.service");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const data = yield (0, auth_service_1.createUser)(userData);
        const payload = {
            userEmail: data === null || data === void 0 ? void 0 : data.email,
            userId: data._id,
        };
        const token = (0, token_service_1.generateToken)(payload);
        // const emailInfo = await sendMail();
        // console.log(emailInfo);
        res.status(200).json({
            message: "Successfully register",
            data: { data, token },
        });
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
});
exports.register = register;
const loginWithEmailAndPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        if (!user) {
            return res.status(500).json({ message: info.message });
        }
        const payload = {
            userEmail: user.email,
            userId: user._id,
        };
        const token = (0, token_service_1.generateToken)(payload);
        res.status(200).json({
            message: "successfully signed in",
            token: token,
            data: user,
        });
    })(req, res, next);
});
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
