# Document Upload & Checking System Explanation

## 🔍 How Document Checking Works

### 1. **Document Status Hook** (`useDocumentStatus.ts`)

This hook manages the document checking logic:

```typescript
export const useDocumentStatus = () => {
  const { user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<DocumentStatus>({
    hasDocuments: false,
    isLoading: true,
    error: null,
    documents: []
  });

  const checkDocuments = async () => {
    if (!user?.id) return;

    try {
      // Call API to get user's uploaded documents
      const documents = await uploadsApi.listUserSignupDocuments(user.id);
      
      // Check if documents exist and are not empty
      setStatus({
        hasDocuments: documents && Array.isArray(documents) && documents.length > 0,
        isLoading: false,
        error: null,
        documents: documents || []
      });
    } catch (error) {
      // Handle errors gracefully
      setStatus({
        hasDocuments: false,
        isLoading: false,
        error: 'Failed to check document status',
        documents: []
      });
    }
  };
};
```

### 2. **API Endpoint Used**

The system uses this API endpoint to check documents:

```typescript
GET /uploads/documents/signup/{user_id}
```

**Response Format:**
```json
[
  {
    "id": 1,
    "file_path": "documents/signup/user_123/national_id.pdf",
    "entity_type": "documents",
    "entity_id": 1,
    "uploaded_at": "2024-01-15T10:30:00Z"
  }
]
```

### 3. **Dashboard Guard Logic** (`DashboardGuard.tsx`)

The guard component checks documents before allowing dashboard access:

```typescript
export const DashboardGuard: React.FC<DashboardGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { hasDocuments, isLoading, error } = useDocumentStatus();

  // Show loading while checking
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to upload page if no documents
  if (!hasDocuments && !error) {
    return <Navigate to="/upload-documents" replace />;
  }

  // Allow dashboard access if documents exist
  return <>{children}</>;
};
```

### 4. **Document Upload Process**

When a user uploads documents:

```typescript
const uploadDocument = async (document: DocumentUpload) => {
  if (!document.file || !user?.id) return;

  try {
    // Upload to API
    const response = await uploadsApi.uploadUserDocument(
      document.file,
      document.docType,
      document.expiryDate
    );
    
    return response.id;
  } catch (error) {
    throw error;
  }
};
```

**API Endpoint Used:**
```typescript
POST /uploads/documents/signup
Content-Type: multipart/form-data

Body:
- file: File (PDF, JPG, PNG)
- doc_type: string (e.g., "National ID")
- expiry_date: string (YYYY-MM-DD)
```

### 5. **Complete Flow Diagram**

```
User Login
    ↓
Check Authentication
    ↓
Check Document Status
    ↓
┌─────────────────┬─────────────────┐
│   Has Documents │  No Documents   │
│        ↓        │        ↓        │
│   Show Dashboard│ Redirect to     │
│                 │ Upload Page     │
└─────────────────┴─────────────────┘
```

### 6. **Document Status States**

The system handles these states:

1. **Loading**: `isLoading: true`
   - Shows loading spinner
   - Prevents dashboard access

2. **No Documents**: `hasDocuments: false`
   - Redirects to upload page
   - Blocks dashboard access

3. **Has Documents**: `hasDocuments: true`
   - Allows dashboard access
   - User can proceed normally

4. **Error**: `error: string`
   - Logs warning
   - Allows dashboard access (graceful fallback)

### 7. **Real-time Updates**

After successful upload:

```typescript
// Upload documents
const results = await Promise.all(uploadPromises);

// Refresh document status
await refetch();

// Redirect to dashboard
setTimeout(() => {
  navigate('/dashboard');
}, 2000);
```

### 8. **Security Features**

1. **Authentication Required**: All document operations require valid JWT token
2. **User Isolation**: Users can only access their own documents
3. **File Validation**: Only PDF, JPG, PNG files allowed
4. **Error Handling**: Graceful fallback on API errors

### 9. **API Integration Details**

#### Document Upload API:
```typescript
POST /uploads/documents/signup
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body:
  file: File
  doc_type: string
  expiry_date: string
```

#### Document List API:
```typescript
GET /uploads/documents/signup/{user_id}
Headers:
  Authorization: Bearer <token>

Response:
  Array of document objects or empty array
```

### 10. **Error Scenarios Handled**

1. **Network Error**: Shows error message, allows retry
2. **Authentication Error**: Redirects to login
3. **File Upload Error**: Shows specific error message
4. **API Error**: Graceful fallback, allows dashboard access

### 11. **User Experience Flow**

1. **User logs in** → Redirected to `/upload-documents`
2. **Upload page loads** → Shows document upload form
3. **User uploads documents** → Real-time status updates
4. **Upload completes** → Success message shown
5. **Status refreshes** → Document status updated
6. **Redirect to dashboard** → User can access dashboard

### 12. **Code Examples**

#### Check if user has documents:
```typescript
const { hasDocuments, isLoading } = useDocumentStatus();

if (isLoading) return <LoadingSpinner />;
if (!hasDocuments) return <Navigate to="/upload-documents" />;
return <Dashboard />;
```

#### Upload document:
```typescript
const uploadDocument = async (file: File, docType: string, expiryDate: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_type', docType);
  formData.append('expiry_date', expiryDate);
  
  const response = await api.upload('/uploads/documents/signup', file, {
    doc_type: docType,
    expiry_date: expiryDate,
  });
  
  return response;
};
```

#### Refresh document status:
```typescript
const { refetch } = useDocumentStatus();

// After successful upload
await refetch();
```

This system ensures that users must upload required documents before accessing the dashboard, while providing a smooth user experience with proper error handling and real-time status updates.
