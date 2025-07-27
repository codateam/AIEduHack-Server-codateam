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
      enum: ["admin", "lecturer", "student", "super_admin"],
      default: "student",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: function(this: any) {
        return this.role !== "admin" && this.role !== "super_admin";
      },
    },
    userToken: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve by default, can be changed per organization
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

// Compound index for organization-scoped queries
userSchema.index({ organizationId: 1, role: 1 });
userSchema.index({ organizationId: 1, email: 1 });

userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
