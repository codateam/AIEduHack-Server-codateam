"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
const routes_1 = __importDefault(require("./core/commons/routes"));
const error_handler_1 = __importDefault(require("./core/middlewares/error-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
require("./config/passport");
const logger_1 = require("./config/logger");
const app = (0, express_1.default)();
// // Graphql setup
// const typeDefs = `#graphql
//   type Query {
//     hello: String
//   }
// `;
// const resolvers = {
//   Query: {
//     hello: () => "Hello World!",
//   },
// };
// Graphql apollo server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   // plugins: [ApolloServerPluginDrainHttpServer({ app })],
// });
// Set session
// app.set("trust proxy", 1);
// app.use(
//   session({
//     secret: config.jwt.secret as string,
//     resave: true,
//     saveUninitialized: true,
//   }),
// );
// Helmet
app.use((0, helmet_1.default)());
// app.use(passport.initialize());
// app.use(passport.session());
// const compressionOptions: CompressionOptions = {};
// middlewares;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)(config_1.corsOptions));
// app.use(compression());
app.use((0, cors_1.default)(config_1.corsOptions));
app.use(express_1.default.json());
app.use(logger_1.morganMiddleware);
// mongoose.set("strictQuery", false);
mongoose_1.default.set("strictQuery", true);
mongoose_1.default
    .connect(config_1.config.mongo.url)
    .then(() => {
    console.log("connected to database");
})
    .catch((error) => {
    console.log(error);
});
app.use("/api/v1", routes_1.default);
// app.use("/api/v1/graphql", cors(), expressMiddleware(server));
app.use(error_handler_1.default);
const port = (_a = config_1.config.PORT) !== null && _a !== void 0 ? _a : 3333;
app.listen(port, () => {
    // await server.start();
    // server.applyMiddleware({ app, path: "/api/v1/graphql" });
    // startAppoloserver();
    console.log(`Listening at http://localhost:${port}/api`);
});
exports.default = app;
