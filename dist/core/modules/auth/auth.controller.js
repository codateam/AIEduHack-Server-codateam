"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithEmailAndPassword = exports.getUsersByOrg = exports.getOrgAdmins = exports.getAdmins = exports.getStudents = exports.getLecturers = exports.createSuperAdminEndpoint = exports.createLecturer = exports.createOrgAdmin = exports.registerStudent = void 0;
const auth_service_1 = require("./auth.service");
const passport_1 = __importDefault(require("passport"));
const token_service_1 = require("./token.service");
const response_formater_1 = require("../../../utils/response-formater");
const registerStudent = async (req, res, next) => {
    try {
        const userData = req.body;
        userData.role = "student";
        const data = await (0, auth_service_1.createUser)(userData);
        const token = (0, token_service_1.generateToken)(data);
        (0, response_formater_1.response)(res, "Student Signup Successfully", 201, { data, token });
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.registerStudent = registerStudent;
const createOrgAdmin = async (req, res) => {
    try {
        const userData = req.body;
        userData.password = userData.password || "Sosimple@19";
        userData.role = "admin";
        const data = await (0, auth_service_1.createUser)(userData);
        (0, response_formater_1.response)(res, "Organization Admin Added Successfully", 201, data);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.createOrgAdmin = createOrgAdmin;
const createLecturer = async (req, res) => {
    try {
        const user = req.user;
        const userData = req.body;
        userData.password = userData.password || "lecturer";
        userData.role = "lecturer";
        userData.organizationId = user.organizationId;
        const data = await (0, auth_service_1.createUser)(userData);
        (0, response_formater_1.response)(res, "Lecturer Added Successfully", 201, data);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.createLecturer = createLecturer;
const createSuperAdminEndpoint = async (req, res) => {
    try {
        const userData = req.body;
        // Validate required fields
        if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
            return res.status(400).json({
                message: "Email, password, firstName, and lastName are required"
            });
        }
        const data = await (0, auth_service_1.createSuperAdmin)(userData);
        (0, response_formater_1.response)(res, "Super Admin Created Successfully", 201, data);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.createSuperAdminEndpoint = createSuperAdminEndpoint;
// Organization-scoped user retrieval functions
const getLecturers = async (req, res, next) => {
    try {
        const { page, limit, search, organizationId } = req.query;
        // If user is admin, filter by their organization
        const user = req.user;
        const orgId = (user === null || user === void 0 ? void 0 : user.role) === 'admin' ? user.organizationId.id : organizationId;
        const users = await (0, auth_service_1.getUsersByRole)("lecturer", parseInt(page, 10), parseInt(limit, 10), search, orgId);
        (0, response_formater_1.response)(res, "Lecturers Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getLecturers = getLecturers;
const getStudents = async (req, res, next) => {
    try {
        const { page, limit, search, organizationId } = req.query;
        // If user is admin or lecturer, filter by their organization
        const user = req.user;
        const orgId = ((user === null || user === void 0 ? void 0 : user.role) === 'admin' || (user === null || user === void 0 ? void 0 : user.role) === 'lecturer') ? user.organizationId : organizationId;
        const users = await (0, auth_service_1.getUsersByRole)("student", parseInt(page, 10), parseInt(limit, 10), search, orgId);
        (0, response_formater_1.response)(res, "Students Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getStudents = getStudents;
const getAdmins = async (req, res, next) => {
    try {
        const { page, limit, organizationId } = req.query;
        const users = await (0, auth_service_1.getUsersByRole)("admin", parseInt(page, 10), parseInt(limit, 10), "", organizationId);
        (0, response_formater_1.response)(res, "Admins Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getAdmins = getAdmins;
const getOrgAdmins = async (req, res, next) => {
    try {
        const { page, limit, organizationId } = req.query;
        const users = await (0, auth_service_1.getUsersByRole)("admin", parseInt(page, 10), parseInt(limit, 10), "", organizationId);
        (0, response_formater_1.response)(res, "Organization Admins Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getOrgAdmins = getOrgAdmins;
const getUsersByOrg = async (req, res, next) => {
    try {
        const { organizationId } = req.params;
        const { page, limit, search, role } = req.query;
        const users = await (0, auth_service_1.getUsersByOrganization)(organizationId, parseInt(page, 10), parseInt(limit, 10), search, role);
        (0, response_formater_1.response)(res, "Organization Users Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getUsersByOrg = getUsersByOrg;
const loginWithEmailAndPassword = async (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, (error, user, info) => {
        var _a, _b, _c;
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        if (!user) {
            return res.status(500).json({ message: info.message });
        }
        const payload = Object.assign(Object.assign({}, user._doc), { id: user._doc._id, organizationId: (_c = (_b = (_a = user._doc) === null || _a === void 0 ? void 0 : _a.organizationId) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "" });
        const token = (0, token_service_1.generateToken)(payload);
        (0, response_formater_1.response)(res, "successfully signed in", 200, { user, token });
    })(req, res, next);
};
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
