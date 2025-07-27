"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganization = exports.updateOrganization = exports.disapproveOrganization = exports.approveOrganization = exports.getPendingOrganizations = exports.getActiveOrganizations = exports.getOrganizationByCode = exports.getOrganizationById = exports.getAllOrganizations = exports.createOrganization = void 0;
const org_model_1 = __importDefault(require("./org.model"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const createOrganization = async (data) => {
    const { mainAdminData } = data, orgData = __rest(data, ["mainAdminData"]);
    // Check if organization code already exists
    const existingOrg = await org_model_1.default.findOne({ code: orgData.code });
    if (existingOrg) {
        throw new Error("Organization code already exists");
    }
    // Check if admin email already exists
    const existingUser = await auth_model_1.default.findOne({ email: mainAdminData.email });
    if (existingUser) {
        throw new Error("Admin email already exists");
    }
    // // Hash admin password
    // const hashedPassword = await bcrypt.hash(mainAdminData.password, 12);
    // Create main admin user first
    const mainAdmin = await auth_model_1.default.create({
        firstName: mainAdminData.firstName,
        lastName: mainAdminData.lastName,
        email: mainAdminData.email,
        password: mainAdminData.password,
        role: "admin",
        isApproved: true,
        // organizationId will be set after organization creation
    });
    // Create organization
    const organization = await org_model_1.default.create(Object.assign(Object.assign({}, orgData), { mainAdmin: mainAdmin._id, isApproved: true }));
    // Update main admin with organization ID
    await auth_model_1.default.findByIdAndUpdate(mainAdmin._id, { organizationId: organization._id });
    return organization;
};
exports.createOrganization = createOrganization;
const getAllOrganizations = async (page = 1, limit = 10, search, includeUnapproved = false) => {
    const query = {};
    if (!includeUnapproved) {
        query.isApproved = true;
    }
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { code: { $regex: search, $options: "i" } },
            { type: { $regex: search, $options: "i" } },
        ];
    }
    const skip = (page - 1) * limit;
    const organizations = await org_model_1.default.find(query)
        .populate("mainAdmin", "firstName lastName email")
        .populate("approvedBy", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const total = await org_model_1.default.countDocuments(query);
    const pages = Math.ceil(total / limit);
    return { organizations, total, pages };
};
exports.getAllOrganizations = getAllOrganizations;
const getOrganizationById = async (id) => {
    return await org_model_1.default.findById(id)
        .populate("mainAdmin", "firstName lastName email")
        .populate("approvedBy", "firstName lastName email");
};
exports.getOrganizationById = getOrganizationById;
const getOrganizationByCode = async (code) => {
    return await org_model_1.default.findOne({ code: code.toUpperCase(), isApproved: true, isActive: true });
};
exports.getOrganizationByCode = getOrganizationByCode;
const getActiveOrganizations = async () => {
    return await org_model_1.default.find({ isActive: true, isApproved: true })
        .select("name code type description")
        .sort({ name: 1 });
};
exports.getActiveOrganizations = getActiveOrganizations;
const getPendingOrganizations = async () => {
    return await org_model_1.default.find({ isApproved: false })
        .populate("mainAdmin", "firstName lastName email")
        .sort({ createdAt: -1 });
};
exports.getPendingOrganizations = getPendingOrganizations;
const approveOrganization = async (organizationId, approvedBy) => {
    return await org_model_1.default.findByIdAndUpdate(organizationId, {
        isApproved: true,
        approvedBy,
        approvedAt: new Date(),
    }, { new: true }).populate("mainAdmin", "firstName lastName email");
};
exports.approveOrganization = approveOrganization;
const disapproveOrganization = async (organizationId) => {
    return await org_model_1.default.findByIdAndUpdate(organizationId, {
        isApproved: false,
        approvedBy: undefined,
        approvedAt: undefined,
    }, { new: true });
};
exports.disapproveOrganization = disapproveOrganization;
const updateOrganization = async (id, data) => {
    return await org_model_1.default.findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate("mainAdmin", "firstName lastName email");
};
exports.updateOrganization = updateOrganization;
const deleteOrganization = async (id) => {
    return await org_model_1.default.findByIdAndUpdate(id, { isActive: false }, { new: true });
};
exports.deleteOrganization = deleteOrganization;
