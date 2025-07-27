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
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.config = {
    PORT: process.env.PORT,
    mongo: {
        url: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: process.env.JWT_MAX_AGE,
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
    },
    facebook: {
        AppId: process.env.FACEBOOK_APPID,
        App_secret: process.env.FACEBOOK_APP_SECRET,
    },
    email: {
        user: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD,
        service: process.env.EMAIL_SERVICE,
    },
    //   client: {
    //     url: process.env.CLIENT_URL,
    //     resetUrl: process.env.CLIENT_RESET_URL,
    //     oauthRedirectUrl: process.env.CLIENT_OAUTH_REDIRECT_URL,
    //     confirmUrl: process.env.CLIENT_CONFIRM_URL,
    //   },
};
exports.corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};
