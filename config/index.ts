import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  AI_BASE_URL: process.env.AI_BASE_URL,
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

export const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};
