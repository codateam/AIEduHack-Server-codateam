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
exports.loginWithThirdPartyService = exports.createUser = exports.loginWithEmailAndPassword = exports.findUserById = exports.findUser = void 0;
const auth_model_1 = __importDefault(require("./auth.model"));
const bcrypt = __importStar(require("bcrypt"));
const findUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield auth_model_1.default.findOne({ email: email });
    return isUser;
});
exports.findUser = findUser;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield auth_model_1.default.findOne({ _id: id }).select("-password");
    return isUser;
});
exports.findUserById = findUserById;
const loginWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.default.findOne({ email: email });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isPassValid = yield bcrypt.compare(password, user.password);
    if (!isPassValid) {
        throw new Error("Invalid email or password");
    }
    user.password = "";
    return { userId: user._id };
});
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const isUser = yield (0, exports.findUser)(userData.email);
    if (isUser) {
        throw new Error("user already exist");
    }
    const user = yield auth_model_1.default.create(userData);
    return user;
});
exports.createUser = createUser;
const loginWithThirdPartyService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ userData });
    const user = yield auth_model_1.default.findOne({ email: userData.email }).select("-password");
    if (!user) {
        const newUser = yield auth_model_1.default.create(userData);
        return newUser;
    }
    return user;
});
exports.loginWithThirdPartyService = loginWithThirdPartyService;
// export const sendMail = async () => {
//   const transporter = nodemailer.createTransport({
//     service: config.email.service,
//     auth: {
//       type: "OAuth2",
//       user: config.email.user,
//       pass: config.email.password,
//       clientId: config.google.clientID,
//       clientSecret: config.google.clientSecret,
//       refreshToken: config.google.refreshToken,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: "jokanola.it@gmail.com", // sender address
//     to: "jokanolatest@gmail.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     // text: 'Hello world?', // plain text body
//     html: "<b>Testing Testing?</b>", // html body
//   // console.log("Message sent: %s", info.messageId)
// };
