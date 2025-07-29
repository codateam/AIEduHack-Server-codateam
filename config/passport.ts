import passport from "passport";
import localPassport from "passport-local";
import googlePassport from "passport-google-oauth20";
import facebookPassport from "passport-facebook";
// import * as linkedPassport from "passport-linkedin-oauth2";
import { config } from ".";
import {
  findUserById,
  loginWithEmailAndPassword,
  // loginWithThirdPartyService,
} from "../core/modules/auth/auth.service";

const LocalStrategy = localPassport.Strategy;
const GoogleStrategy = googlePassport.Strategy;
const FacekookStrategy = facebookPassport.Strategy;
// const LinkedInStrategy = linkedPassport.Strategy;

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  findUserById(id).then((user: any) => {
    done(null, user);
  });
});

// local authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user: any = await loginWithEmailAndPassword(email, password);
        if (user) {
          // const userWithId = { ...user, id: user._id };
          return done(null, user);
        }
      } catch (error: any) {
        // console.error(error.message);
        done(error, false, { message: error.message });
      }
    },
  ),
);

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
