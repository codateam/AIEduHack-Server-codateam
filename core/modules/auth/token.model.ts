import * as mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    require: true,
  },
  userId: {
    type: String,
    require: true,
    ref: "User",
  },
  expiryDate: {
    type: Date,
    default: Date.now(),
    index: { expires: "1m" },
  },
});

// tokenSchema.pre('save', async function (next) {
//   this.expiryDate = Date.now() + 360000000;
//   next();
// });

const Token = mongoose.model("Token", tokenSchema);

export default Token;
