import User from "./auth.model";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import { config } from "../../../config";
export const findUser = async (email: string) => {
  const isUser = await User.findOne({ email: email });
  return isUser;
};

export const findUserById = async (id: string) => {
  const isUser = await User.findById(id).select("-password");
  return isUser;
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPassValid = await bcrypt.compare(password, user.password);
  if (!isPassValid) {
    throw new Error("Invalid email or password");
  }

  user.password = "";
  return user;
};

export const createUser = async (userData: any) => {
  const isUser = await findUser(userData.email);
  if (isUser) {
    throw new Error("user already exist");
  }
  const user = await User.create(userData);
  return user;
};

export const getUsersByRole = async (
  role: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({
      role: role,
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { middleName: { $regex: search, $options: "i" } },
        { matricNo: { $regex: search, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(limit)
      .skip(skip),
    User.countDocuments({
      role: role,
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { middleName: { $regex: search, $options: "i" } },
        { matricNo: { $regex: search, $options: "i" } },
      ],
    }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};
