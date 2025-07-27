"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const auth_service_1 = require("../core/modules/auth/auth.service");
const LocalStrategy = passport_local_1.default.Strategy;
const GoogleStrategy = passport_google_oauth20_1.default.Strategy;
const FacekookStrategy = passport_facebook_1.default.Strategy;
// const LinkedInStrategy = linkedPassport.Strategy;
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    (0, auth_service_1.findUserById)(id).then((user) => {
        done(null, user);
    });
});
// local authentication
passport_1.default.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const user = await (0, auth_service_1.loginWithEmailAndPassword)(email, password);
        if (user) {
            // const userWithId = { ...user, id: user._id };
            return done(null, user);
        }
    }
    catch (error) {
        // console.error(error.message);
        done(error, false, { message: error.message });
    }
}));
//Google Auth
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: config.google.clientID as string,
//       clientSecret: config.google.clientSecret as string,
//       callbackURL: "http://localhost:3333/api/v1/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile: any, done) => {
//       try {
//         const userData = {
//           firstName: profile._json.given_name.toLowerCase(),
//           lastName: profile._json.family_name.toLowerCase(),
//           email: profile.emails[0].value,
//           profilepics: profile._json.picture,
//           isConfirmed: true,
//         };
//         const user = await loginWithThirdPartyService(userData);
//         done(null, user);
//       } catch (error: any) {
//         // console.error(error.message);
//         done(null, false);
//       }
//     }
//   )
// );
//Facebook Authentication
// passport.use(
//   new FacekookStrategy(
//     {
//       clientID: config.facebook.AppId as string,
//       clientSecret: config.facebook.App_secret as string,
//       callbackURL: "http://localhost:3333/api/v1/auth/facebook/callback",
//       profileFields: ["id", "displayName", "photos", "email"],
//       enableProof: true,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         console.log({ profile });
//         // const userData = {
//         //   firstName: profile._json.given_name.toLowerCase(),
//         //   lastName: profile._json.family_name.toLowerCase(),
//         //   email: profile.emails[0].value,
//         //   profilepics: profile._json.picture,
//         //   isConfirmed: true,
//         // };
//         // const user = await loginWithThirdPartyService(userData);
//         done(null, profile);
//       } catch (error: any) {
//         console.error({ error });
//         done(null, false);
//       }
//     }
//     //   function (accessToken, refreshToken, profile, cb) {
//     //     console.log({ profile });
//     //     const user = await loginWithThirdPartyService(userData);
//     // )
//   )
// );
//LinkedIn Authentication
// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: config.linkedin.linkedinClientID,
//       clientSecret: config.linkedin.linkedinClientSecret,
//       callbackURL: "http://localhost:3333/api/v1/auth/linkedin/callback",
//       scope: ["r_emailaddress", "r_liteprofile"],
//       state: true,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       // asynchronous verification, for effect...
//       process.nextTick(function () {
//         // To keep the example simple, the user's LinkedIn profile is returned to
//         // represent the logged-in user. In a typical application, you would want
//         // to associate the LinkedIn account with a user record in your database,
//         // and return that user instead.
//         console.log(profile);
//         return done(null, profile);
//       });
//     }
//   )
// );
