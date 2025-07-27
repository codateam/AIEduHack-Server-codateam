import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/async-handler";
import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  getActiveOrganizations,
  getPendingOrganizations,
  approveOrganization,
  disapproveOrganization,
  updateOrganization,
  deleteOrganization,
} from "./org.service";

// Public endpoint - anyone can create an organization
export const createOrg = asyncHandler(async (req: Request, res: Response) => {
  const { organization, mainAdmin } = req.body;

  if (!organization || !mainAdmin) {
    return res.status(400).json({
      success: false,
      message: "Organization data and main admin data are required",
    });
  }

  const newOrganization = await createOrganization({
    ...organization,
    mainAdminData: mainAdmin,
  });

  res.status(201).json({
    success: true,
    message: "Organization created successfully",
    data: newOrganization,
  });
});

// Super admin only - get all organizations including pending
export const getAllOrgs = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search, includeUnapproved = false } = req.query;
  
  const result = await getAllOrganizations(
    Number(page),
    Number(limit),
    search as string,
    includeUnapproved === 'true'
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

// Public endpoint - get active approved organizations
export const getActiveOrgs = asyncHandler(async (req: Request, res: Response) => {
  const organizations = await getActiveOrganizations();

  res.status(200).json({
    success: true,
    data: organizations,
  });
});

// Super admin only - get pending organizations
export const getPendingOrgs = asyncHandler(async (req: Request, res: Response) => {
  const organizations = await getPendingOrganizations();

  res.status(200).json({
    success: true,
    data: organizations,
  });
});

// Super admin only - approve organization
export const approveOrg = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const approvedBy = (req as any).user.id;

  const organization = await approveOrganization(id, approvedBy);

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
export const disapproveOrg = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const organization = await disapproveOrganization(id);

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

export const getOrgById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const organization = await getOrganizationById(id);

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

export const updateOrg = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const organization = await updateOrganization(id, req.body);

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

export const deleteOrg = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const organization = await deleteOrganization(id);

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