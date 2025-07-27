"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithEmailAndPassword = exports.getAdmins = exports.getStudents = exports.getLecturers = exports.createLecturer = exports.createAdmin = exports.registerStudent = void 0;
const auth_service_1 = require("./auth.service");
const passport_1 = __importDefault(require("passport"));
const token_service_1 = require("./token.service");
const response_formater_1 = require("../../../utils/response-formater");
const registerStudent = async (req, res, next) => {
    try {
        const userData = req.body;
        const data = await (0, auth_service_1.createUser)(userData);
        const token = (0, token_service_1.generateToken)(data);
        (0, response_formater_1.response)(res, "Student Signup Successfully", 201, { data, token });
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.registerStudent = registerStudent;
const createAdmin = async (req, res) => {
    try {
        const userData = req.body;
        userData.password = "admin";
        userData.role = "admin";
        const data = await (0, auth_service_1.createUser)(userData);
        (0, response_formater_1.response)(res, "Admin Added Successfully", 201, data);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.createAdmin = createAdmin;
const createLecturer = async (req, res) => {
    try {
        const userData = req.body;
        userData.password = "lecturer";
        userData.role = "lecturer";
        const data = await (0, auth_service_1.createUser)(userData);
        (0, response_formater_1.response)(res, "Lecturer Added Successfully", 201, data);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.createLecturer = createLecturer;
// create 3 function for lecturer, admin and student
const getLecturers = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query;
        const users = await (0, auth_service_1.getUsersByRole)("lecturer", parseInt(page, 10), parseInt(limit, 10), search);
        (0, response_formater_1.response)(res, "Lecturers Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getLecturers = getLecturers;
const getStudents = async (req, res, next) => {
    try {
        const { page, limit, search } = req.query;
        const users = await (0, auth_service_1.getUsersByRole)("student", parseInt(page, 10), parseInt(limit, 10), search);
        (0, response_formater_1.response)(res, "Students Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getStudents = getStudents;
const getAdmins = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const users = await (0, auth_service_1.getUsersByRole)("admin", parseInt(page, 10), parseInt(limit, 10));
        (0, response_formater_1.response)(res, "Admins Retrieved Successfully", 200, users);
    }
    catch (error) {
        res.status(402).json({ message: error.message });
    }
};
exports.getAdmins = getAdmins;
const loginWithEmailAndPassword = async (req, res, next) => {
    passport_1.default.authenticate("local", { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        if (!user) {
            return res.status(500).json({ message: info.message });
        }
        const payload = Object.assign(Object.assign({}, user._doc), { id: user._doc._id });
        const token = (0, token_service_1.generateToken)(payload);
        (0, response_formater_1.response)(res, "successfully signed in", 200, { user, token });
    })(req, res, next);
};
exports.loginWithEmailAndPassword = loginWithEmailAndPassword;
