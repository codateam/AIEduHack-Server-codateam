"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.route("/").get((req, res) => {
    res.send("Hello world");
});
router.route("/register").post(auth_controller_1.register);
router.route("/login").post(auth_controller_1.loginWithEmailAndPassword);
router.route("/google").get(passport_1.default.authenticate("google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
}));
router
    .route("/google/callback")
    .get(passport_1.default.authenticate("google"), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/api");
});
// Facebook router
router.route("/facebook").get(passport_1.default.authenticate("facebook"));
router.route("/facebook/callback").get(passport_1.default.authenticate("facebook", {
    failureRedirect: "/api",
    successRedirect: "/api",
    //  res.redirect("/api");
})
// ,
// function (req, res) {
//   // Successful authentication, redirect home.
//   console.log({ res, req });
//   res.redirect("/api");
// }
);
// router
//   .route("/linkedin")
//   .get(
//     passport.authenticate("linkedin", { state: "SOME STATE" }),
//     function (req, res) {
//       // The request will be redirected to LinkedIn for authentication, so this
//       // function will not be called.
//     }
//   );
// router.route("/linkedin/callback").get(
//   passport.authenticate("linkedin", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );
exports.default = router;
