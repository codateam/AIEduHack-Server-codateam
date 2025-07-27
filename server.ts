import express from "express";
import session from "express-session";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import routes from "./core/commons/routes";
import errorHandler from "./core/middlewares/error-handler";
import mongoose from "mongoose";
import passport from "passport";
import { config, corsOptions } from "./config";
import "./config/passport";
import { morganMiddleware } from "./config/logger";

const app = express();

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
app.use(helmet());
// app.use(passport.initialize());
// app.use(passport.session());

// const compressionOptions: CompressionOptions = {};
// middlewares;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
// app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morganMiddleware);

// mongoose.set("strictQuery", false);
mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongo.url as string)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/api/v1", routes);
// app.use("/api/v1/graphql", cors(), expressMiddleware(server));

app.use(errorHandler);
const port = config.PORT ?? 3333;

app.listen(port, () => {
  // await server.start();
  // server.applyMiddleware({ app, path: "/api/v1/graphql" });
  // startAppoloserver();
  console.log(`Listening at http://localhost:${port}/api`);
});

export default app;
