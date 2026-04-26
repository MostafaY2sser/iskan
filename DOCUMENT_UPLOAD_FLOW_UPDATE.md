# Document Upload Flow Update

## Overview
Updated the signup and document upload flow to separate registration from document upload, implementing a post-login document verification system.

## Key Changes

### 1. Registration Flow Changes
- **Removed file upload requirement** from all registration endpoints
- **Registration now redirects to login** instead of document upload
- **Success message** shown on login page after registration

#### Files Modified:
- `src/pages/PropertyOwnerSignup.tsx` - Redirects to login after owner registration
- `src/pages/CompanySignupStep2.tsx` - Redirects to login after company registration

### 2. Document Check System
- **DashboardGuard** now uses `GET /uploads/documents/signup/{user_id}` endpoint
- **Checks for `results` array** in API response
- **Redirects to document upload** if no documents found
- **Allows dashboard access** if documents exist

#### Files Modified:
- `src/components/DashboardGuard.tsx` - Updated to check `response.results` array
- `src/api/endpoints/uploads.ts` - Updated return type to `{ results: UploadOut[] }`

### 3. Document Upload Page
- **Made protected route** - requires authentication
- **Uses authenticated upload** - `POST /uploads/documents/signup` with Bearer token
- **Refreshes document list** after successful uploads
- **Shows uploaded documents** with view/delete functionality

#### Files Modified:
- `src/pages/CompanySignupStep3.tsx` - Updated to handle `response.results` array
- `src/app/router.tsx` - Added `ProtectedRoute` wrapper to document upload page

### 4. Login Page Enhancement
- **Shows success message** after registration
- **Displays registration confirmation** with instructions to upload documents

#### Files Modified:
- `src/pages/Login.tsx` - Added success message display from registration

## New Flow

### 1. Registration Process
```
User Registration → API Call → Success → Redirect to Login
```

### 2. Login Process
```
Login → Check Documents → If No Documents → Redirect to Upload
                              ↓
                         If Documents → Allow Dashboard Access
```

### 3. Document Upload Process
```
Upload Page → Select Files → Upload with Bearer Token → Refresh List → Continue to Dashboard
```

## API Endpoints Used

### Document Check
- **Endpoint**: `GET /uploads/documents/signup/{user_id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ results: [] }` (no documents) or `{ results: [...] }` (with documents)

### Document Upload
- **Endpoint**: `POST /uploads/documents/signup`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `multipart/form-data` with `file`, `doc_type`, `expiry_date`

### Document Management
- **View**: `GET /uploads/documents/{document_id}/view`
- **Delete**: `DELETE /uploads/documents/{document_id}`

## Security Features

### 1. Authentication Required
- All document operations require valid JWT token
- Document upload page is protected route
- Bearer token included in all document API calls

### 2. Access Control
- Users can only upload documents for themselves
- Document check uses authenticated user's ID
- Dashboard access gated by document upload status

## User Experience

### 1. Registration
- Clean registration process without file upload complexity
- Clear success message directing user to login
- No file validation errors during registration

### 2. Login
- Success message from registration displayed
- Clear instructions about document upload requirement
- Smooth transition to document upload if needed

### 3. Document Upload
- Protected page accessible only after login
- Visual feedback for file selection and upload progress
- Document management (view/delete) functionality
- Continue button only enabled after successful upload

## Error Handling

### 1. Registration Errors
- Form validation before API calls
- Clear error messages for failed registration
- Network error handling with user-friendly messages

### 2. Document Check Errors
- Graceful fallback on API failures (allows dashboard access)
- Clear loading states during document status check
- Error logging for debugging

### 3. Upload Errors
- Individual file error tracking
- Retry functionality for failed uploads
- Progress indication during uploads

## Testing Considerations

### 1. Registration Flow
- Test all user types (Customer, Owner, Company Residence)
- Verify redirect to login after successful registration
- Check success message display on login page

### 2. Document Check Flow
- Test with users who have no documents
- Test with users who have uploaded documents
- Test API failure scenarios

### 3. Document Upload Flow
- Test file selection and validation
- Test upload progress and error handling
- Test document management (view/delete)
- Test continue button behavior

## Future Enhancements

### 1. Email Verification
- Add email verification step after registration
- Block document upload until email verified

### 2. Document Types
- Expand document type options
- Add document-specific validation rules

### 3. Admin Approval
- Add admin approval workflow for documents
- Status tracking for document approval

### 4. Notifications
- Email notifications for registration completion
- Document upload confirmations
- Dashboard access notifications
