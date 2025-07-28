import User from "./auth.model";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import { config } from "../../../config";
import { getOrganizationByCode } from "../org/org.service";

export const findUser = async (email: string, organizationId?: string) => {
  const query: any = { email: email };
  if (organizationId) {
    query.organizationId = organizationId;
  }
  const isUser = await User.findOne(query).populate('organizationId', 'name code type');
  return isUser;
};

export const findUserById = async (id: string) => {
  const isUser = await User.findById(id).select("-password").populate('organizationId', 'name code type');
  return isUser;
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const user = await User.findOne({ email: email }).populate('organizationId', 'name code type');
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPassValid = await bcrypt.compare(password, user.password);
  if (!isPassValid) {
    throw new Error("Invalid email or password");
  }

  if (!user.isApproved) {
    throw new Error("Account pending approval");
  }

  user.password = "";
  return user;
};

export const createUser = async (userData: any) => {
  // Handle organization lookup if orgCode is provided instead of organizationId
  // if (userData.orgCode && !userData.organizationId) {
  //   const organization = await getOrganizationByCode(userData.orgCode);
  //   if (!organization) {
  //     throw new Error("Invalid organization code");
  //   }
  //   userData.organizationId = organization._id;
  //   delete userData.orgCode;
  // }

  if (!userData.organizationId) {
    throw new Error("Organization is required");
  }

  const isUser = await findUser(userData.email, userData.organizationId);
  if (isUser) {
    throw new Error("User already exists in this organization");
  }
  
  const user = await User.create(userData);
  return await User.findById(user._id).populate('organizationId', 'name code type');
};

export const createSuperAdmin = async (userData: any) => {
  // Check if user with this email already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Check if super admin already exists
  const existingSuperAdmin = await User.findOne({ role: "super_admin" });
  if (existingSuperAdmin) {
    // If a super admin already exists, this could be for replacement
    // The authorization middleware will ensure only existing super admin can do this
    console.log("Warning: Creating additional super admin. Existing super admin should be removed if this is a replacement.");
  }

  // Super admin doesn't need organizationId
  const superAdminData = {
    ...userData,
    role: "super_admin",
    isApproved: true,
    organizationId: undefined, // Explicitly set to undefined
  };

  const user = await User.create(superAdminData);
  return await User.findById(user._id).select("-password");
};

export const getUsersByRole = async (
  role: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  organizationId?: string,
) => {
  const skip = (page - 1) * limit;

  const baseQuery: any = { role: role };
  
  if (organizationId) {
    baseQuery.organizationId = organizationId;
  }

  const searchQuery = {
    ...baseQuery,
    $or: [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { middleName: { $regex: search, $options: "i" } },
      { matricNo: { $regex: search, $options: "i" } },
    ],
  };

  const [users, total] = await Promise.all([
    User.find(searchQuery)
      .select("-password")
      .populate('organizationId', 'name code type')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }),
    User.countDocuments(searchQuery),
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

export const getUsersByOrganization = async (
  organizationId: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  role?: string,
) => {
  const skip = (page - 1) * limit;

  const baseQuery: any = { organizationId };
  
  if (role) {
    baseQuery.role = role;
  }

  const searchQuery = {
    ...baseQuery,
    $or: [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { middleName: { $regex: search, $options: "i" } },
      { matricNo: { $regex: search, $options: "i" } },
    ],
  };

  const [users, total] = await Promise.all([
    User.find(searchQuery)
      .select("-password")
      .populate('organizationId', 'name code type')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }),
    User.countDocuments(searchQuery),
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
