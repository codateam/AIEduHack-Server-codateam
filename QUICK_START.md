# Quick Start Guide: Public Organization Creation

## 🚀 Getting Started

This guide will help you set up and test the public organization creation system with super admin management.

## Prerequisites

- Node.js and npm installed
- MongoDB running
- Server dependencies installed (`npm install`)

## Setup Steps

### 1. Create Super Admin

First, create the platform super admin:

```bash
npm run create:superadmin
```

**Output:**
```
Super admin created successfully!
Login credentials:
Email: superadmin@platform.com
Password: SuperAdmin123!
```

### 2. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Test Public Organization Creation

Run the automated test:

```bash
npm run test:public-org
```

Or manually test with curl:

```bash
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{
    "organization": {
      "name": "My University",
      "code": "MY_UNIV",
      "type": "university",
      "description": "A great educational institution"
    },
    "mainAdmin": {
      "firstName": "John",
      "lastName": "Admin",
      "email": "admin@myuniv.edu",
      "password": "SecurePass123!"
    }
  }'
```

## Key Features Demonstrated

### ✅ Public Organization Creation
- **Anyone can create** an organization
- **No authentication required**
- **Automatic main admin** creation and assignment
- **Default approval** (organizations are active immediately)

### ✅ Super Admin Management
- **Single super admin** for the entire platform
- **View all organizations** (approved and pending)
- **Approve/disapprove** organizations
- **Delete organizations** if needed

### ✅ Security & Validation
- **Unique organization codes** enforced
- **Unique admin emails** enforced
- **Password hashing** for security
- **Input validation** for all fields

## API Endpoints Summary

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/organizations` | Create new organization |
| GET | `/api/organizations/active` | Get active organizations |

### Super Admin Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations/all` | Get all organizations |
| GET | `/api/organizations/pending` | Get pending organizations |
| PATCH | `/api/organizations/:id/approve` | Approve organization |
| PATCH | `/api/organizations/:id/disapprove` | Disapprove organization |
| DELETE | `/api/organizations/:id` | Delete organization |

## Testing Workflow

### 1. Create Organization (Public)
```bash
# Anyone can do this - no authentication needed
curl -X POST http://localhost:3000/api/organizations \
  -H "Content-Type: application/json" \
  -d '{"organization": {...}, "mainAdmin": {...}}'
```

### 2. Login as Main Admin
```bash
# Use the admin credentials from step 1
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@myuniv.edu",
    "password": "SecurePass123!"
  }'
```

### 3. Login as Super Admin
```bash
# Use super admin credentials
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@platform.com",
    "password": "SuperAdmin123!"
  }'
```

### 4. Manage Organizations (Super Admin)
```bash
# Get all organizations
curl -X GET http://localhost:3000/api/organizations/all \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"

# Approve/disapprove organization
curl -X PATCH http://localhost:3000/api/organizations/ORG_ID/approve \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"
```

## Expected Results

### ✅ Successful Organization Creation
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "_id": "...",
    "name": "My University",
    "code": "MY_UNIV",
    "type": "university",
    "mainAdmin": "...",
    "isApproved": true,
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### ✅ Main Admin Login Success
```json
{
  "success": true,
  "data": {
    "user": {
      "firstName": "John",
      "lastName": "Admin",
      "email": "admin@myuniv.edu",
      "role": "admin",
      "organizationId": "..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Organization Code Already Exists
```json
{
  "success": false,
  "message": "Organization code already exists"
}
```
**Solution:** Use a different organization code

#### 2. Admin Email Already Exists
```json
{
  "success": false,
  "message": "Admin email already exists"
}
```
**Solution:** Use a different admin email

#### 3. Super Admin Not Found
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
**Solution:** Run `npm run create:superadmin` first

#### 4. Validation Errors
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```
**Solution:** Check required fields and format

## Next Steps

1. **Customize Organization Types:** Modify the enum in the model
2. **Add Email Verification:** Implement email verification for main admins
3. **Create Frontend:** Build a UI for organization creation
4. **Add Analytics:** Track organization creation metrics
5. **Implement Notifications:** Email notifications for approvals

## Support

For issues or questions:
1. Check the logs for detailed error messages
2. Verify database connection
3. Ensure all required fields are provided
4. Check the comprehensive documentation in `PUBLIC_ORG_CREATION.md`

---

**🎉 You're all set!** The public organization creation system is now ready to use.