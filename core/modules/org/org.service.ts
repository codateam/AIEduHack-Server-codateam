import Organization from "./org.model";
import User from "../auth/auth.model";
import { IOrganization } from "./org.model";
import { CreateOrganizationRequest, UpdateOrganizationRequest } from "../../../types/organization.interface";
import bcrypt from "bcrypt";

export const createOrganization = async (data: CreateOrganizationRequest & { 
  mainAdminData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
}): Promise<IOrganization> => {
  const { mainAdminData, ...orgData } = data;
  
  // Check if organization code already exists
  const existingOrg = await Organization.findOne({ code: orgData.code });
  if (existingOrg) {
    throw new Error("Organization code already exists");
  }

  // Check if admin email already exists
  const existingUser = await User.findOne({ email: mainAdminData.email });
  if (existingUser) {
    throw new Error("Admin email already exists");
  }

  // // Hash admin password
  // const hashedPassword = await bcrypt.hash(mainAdminData.password, 12);

  // Create main admin user first
  const mainAdmin = await User.create({
    firstName: mainAdminData.firstName,
    lastName: mainAdminData.lastName,
    email: mainAdminData.email,
    password: mainAdminData.password,
    role: "admin",
    isApproved: true,
    // organizationId will be set after organization creation
  });

  // Create organization
  const organization = await Organization.create({
    ...orgData,
    mainAdmin: mainAdmin._id,
    isApproved: true, // Approved by default as requested
  });

  // Update main admin with organization ID
  await User.findByIdAndUpdate(mainAdmin._id, { organizationId: organization._id });

  return organization;
};

export const getAllOrganizations = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  includeUnapproved: boolean = false
): Promise<{ organizations: IOrganization[]; total: number; pages: number }> => {
  const query: any = {};
  
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
  const organizations = await Organization.find(query)
    .populate("mainAdmin", "firstName lastName email")
    .populate("approvedBy", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Organization.countDocuments(query);
  const pages = Math.ceil(total / limit);

  return { organizations, total, pages };
};

export const getOrganizationById = async (id: string): Promise<IOrganization | null> => {
  return await Organization.findById(id)
    .populate("mainAdmin", "firstName lastName email")
    .populate("approvedBy", "firstName lastName email");
};

export const getOrganizationByCode = async (code: string): Promise<IOrganization | null> => {
  return await Organization.findOne({ code: code.toUpperCase(), isApproved: true, isActive: true });
};

export const getActiveOrganizations = async (): Promise<IOrganization[]> => {
  return await Organization.find({ isActive: true, isApproved: true })
    .select("name code type description")
    .sort({ name: 1 });
};

export const getPendingOrganizations = async (): Promise<IOrganization[]> => {
  return await Organization.find({ isApproved: false })
    .populate("mainAdmin", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const approveOrganization = async (
  organizationId: string, 
  approvedBy: string
): Promise<IOrganization | null> => {
  return await Organization.findByIdAndUpdate(
    organizationId,
    {
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
    },
    { new: true }
  ).populate("mainAdmin", "firstName lastName email");
};

export const disapproveOrganization = async (organizationId: string): Promise<IOrganization | null> => {
  return await Organization.findByIdAndUpdate(
    organizationId,
    {
      isApproved: false,
      approvedBy: undefined,
      approvedAt: undefined,
    },
    { new: true }
  );
};

export const updateOrganization = async (
  id: string,
  data: UpdateOrganizationRequest
): Promise<IOrganization | null> => {
  return await Organization.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate("mainAdmin", "firstName lastName email");
};

export const deleteOrganization = async (id: string): Promise<IOrganization | null> => {
  return await Organization.findByIdAndUpdate(id, { isActive: false }, { new: true });
};