"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrg = exports.updateOrg = exports.getOrgById = exports.disapproveOrg = exports.approveOrg = exports.getPendingOrgs = exports.getActiveOrgs = exports.getAllOrgs = exports.createOrg = void 0;
const async_handler_1 = require("../../../utils/async-handler");
const org_service_1 = require("./org.service");
// Public endpoint - anyone can create an organization
exports.createOrg = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { organization, mainAdmin } = req.body;
    if (!organization || !mainAdmin) {
        return res.status(400).json({
            success: false,
            message: "Organization data and main admin data are required",
        });
    }
    const newOrganization = await (0, org_service_1.createOrganization)(Object.assign(Object.assign({}, organization), { mainAdminData: mainAdmin }));
    res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: newOrganization,
    });
});
// Super admin only - get all organizations including pending
exports.getAllOrgs = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, search, includeUnapproved = false } = req.query;
    const result = await (0, org_service_1.getAllOrganizations)(Number(page), Number(limit), search, includeUnapproved === 'true');
    res.status(200).json({
        success: true,
        data: result,
    });
});
// Public endpoint - get active approved organizations
exports.getActiveOrgs = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const organizations = await (0, org_service_1.getActiveOrganizations)();
    res.status(200).json({
        success: true,
        data: organizations,
    });
});
// Super admin only - get pending organizations
exports.getPendingOrgs = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const organizations = await (0, org_service_1.getPendingOrganizations)();
    res.status(200).json({
        success: true,
        data: organizations,
    });
});
// Super admin only - approve organization
exports.approveOrg = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const approvedBy = req.user.id;
    const organization = await (0, org_service_1.approveOrganization)(id, approvedBy);
    if (!organization) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Organization approved successfully",
        data: organization,
    });
});
// Super admin only - disapprove organization
exports.disapproveOrg = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const organization = await (0, org_service_1.disapproveOrganization)(id);
    if (!organization) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Organization disapproved successfully",
        data: organization,
    });
});
exports.getOrgById = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const organization = await (0, org_service_1.getOrganizationById)(id);
    if (!organization) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
        });
    }
    res.status(200).json({
        success: true,
        data: organization,
    });
});
exports.updateOrg = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const organization = await (0, org_service_1.updateOrganization)(id, req.body);
    if (!organization) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Organization updated successfully",
        data: organization,
    });
});
exports.deleteOrg = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const organization = await (0, org_service_1.deleteOrganization)(id);
    if (!organization) {
        return res.status(404).json({
            success: false,
            message: "Organization not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Organization deleted successfully",
    });
});
