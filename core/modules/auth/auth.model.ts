import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../../../types/user.interface";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    middleName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    matricNo: {
      type: String,
      // unique: true,
      default: "",
      // require: true,
    },
    password: {
      type: String,
      default: "",
    },
    profilepics: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "lecturer", "student"],
      default: "student",
    },
    userToken: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, rec) {
        rec.id = rec._id;
        delete rec.__v;
        delete rec._id;
        delete rec.salt;
        delete rec.hash;
        // delete rec.pass
      },
    },
  },
);

userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
