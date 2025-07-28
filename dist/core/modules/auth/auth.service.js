"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByOrganization = exports.getUsersByRole = exports.createSuperAdmin = exports.createUser = exports.loginWithEmailAndPassword = exports.findUserById = exports.findUser = void 0;
const auth_model_1 = __importDefault(require("./auth.model"));
const bcrypt = __importStar(require("bcrypt"));
const findUser = async (email, organizationId) => {
    const query = { email: email };
    if (organizationId) {
        query.organizationId = organizationId;
    }
    const isUser = await auth_model_1.default.findOne(query).populate('organizationId', 'name code type');
    return isUser;
};
exports.findUser = findUser;
const findUserById = async (id) => {
    const isUser = await auth_model_1.default.findById(id).select("-password").populate('organizationId', 'name code type');
    return isUser;
};
exports.findUserById = findUserById;
const loginWithEmailAndPassword = async (email, password) => {
    const user = await auth_model_1.default.findOne({ email: email }).populate('organizationId', 'name code type');
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
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
const createUser = async (userData) => {
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
    const isUser = await (0, exports.findUser)(userData.email, userData.organizationId);
    if (isUser) {
        throw new Error("User already exists in this organization");
    }
    const user = await auth_model_1.default.create(userData);
    return await auth_model_1.default.findById(user._id).populate('organizationId', 'name code type');
};
exports.createUser = createUser;
const createSuperAdmin = async (userData) => {
    // Check if user with this email already exists
    const existingUser = await auth_model_1.default.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    // Check if super admin already exists
    const existingSuperAdmin = await auth_model_1.default.findOne({ role: "super_admin" });
    if (existingSuperAdmin) {
        // If a super admin already exists, this could be for replacement
        // The authorization middleware will ensure only existing super admin can do this
        console.log("Warning: Creating additional super admin. Existing super admin should be removed if this is a replacement.");
    }
    // Super admin doesn't need organizationId
    const superAdminData = Object.assign(Object.assign({}, userData), { role: "super_admin", isApproved: true, organizationId: undefined });
    const user = await auth_model_1.default.create(superAdminData);
    return await auth_model_1.default.findById(user._id).select("-password");
};
exports.createSuperAdmin = createSuperAdmin;
const getUsersByRole = async (role, page = 1, limit = 10, search = "", organizationId) => {
    const skip = (page - 1) * limit;
    const baseQuery = { role: role };
    if (organizationId) {
        baseQuery.organizationId = organizationId;
    }
    const searchQuery = Object.assign(Object.assign({}, baseQuery), { $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { middleName: { $regex: search, $options: "i" } },
            { matricNo: { $regex: search, $options: "i" } },
        ] });
    const [users, total] = await Promise.all([
        auth_model_1.default.find(searchQuery)
            .select("-password")
            .populate('organizationId', 'name code type')
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 }),
        auth_model_1.default.countDocuments(searchQuery),
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
exports.getUsersByRole = getUsersByRole;
const getUsersByOrganization = async (organizationId, page = 1, limit = 10, search = "", role) => {
    const skip = (page - 1) * limit;
    const baseQuery = { organizationId };
    if (role) {
        baseQuery.role = role;
    }
    const searchQuery = Object.assign(Object.assign({}, baseQuery), { $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { middleName: { $regex: search, $options: "i" } },
            { matricNo: { $regex: search, $options: "i" } },
        ] });
    const [users, total] = await Promise.all([
        auth_model_1.default.find(searchQuery)
            .select("-password")
            .populate('organizationId', 'name code type')
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 }),
        auth_model_1.default.countDocuments(searchQuery),
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
exports.getUsersByOrganization = getUsersByOrganization;
