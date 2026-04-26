# Document Upload & Checking Flow Diagram

## 🔄 Complete User Flow

```
┌─────────────────┐
│   User Login    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check Auth      │
│ Status          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check Document  │
│ Status via API  │
│ GET /uploads/   │
│ documents/      │
│ signup/{user_id}│
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │ Has     │
    │ Docs?   │
    └────┬────┘
         │
    ┌────▼────┐
    │   YES   │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Show Dashboard  │
│ ✅ Access       │
│ Allowed         │
└─────────────────┘

    ┌────▼────┐
    │   NO    │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│ Upload Page     │
│ /upload-        │
│ documents       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User Uploads    │
│ Documents       │
│ POST /uploads/  │
│ documents/      │
│ signup          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Refresh         │
│ Document        │
│ Status          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Redirect to     │
│ Dashboard       │
│ ✅ Success      │
└─────────────────┘
```

## 🛡️ Security & Error Handling

```
┌─────────────────┐
│ API Error       │
│ or Network      │
│ Issue           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Log Error       │
│ Show Warning    │
│ Allow Access    │
│ (Graceful       │
│ Fallback)       │
└─────────────────┘

┌─────────────────┐
│ Authentication  │
│ Failed          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Redirect to     │
│ Login Page      │
│ /login          │
└─────────────────┘
```

## 📱 UI States

```
┌─────────────────┐
│ Loading State   │
│ (Checking Docs) │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Show Spinner    │
│ "جاري التحقق من │
│ المستندات..."   │
└─────────────────┘

┌─────────────────┐
│ Upload State    │
│ (Uploading)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Show Progress   │
│ "جاري الرفع..." │
└─────────────────┘

┌─────────────────┐
│ Success State   │
│ (Uploaded)      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Show Success    │
│ "تم رفع         │
│ المستندات       │
│ بنجاح!"         │
└─────────────────┘
```

## 🔧 API Endpoints Used

### 1. Check Documents
```
GET /uploads/documents/signup/{user_id}
Headers: Authorization: Bearer <token>
Response: Array of documents or empty array
```

### 2. Upload Document
```
POST /uploads/documents/signup
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: file, doc_type, expiry_date
Response: Upload confirmation
```

### 3. Authentication
```
POST /auth/login
Body: email, password
Response: access_token, user_id, user_type
```

## 📊 Document Status Logic

```typescript
// Check if user has documents
const hasDocuments = documents && 
                    Array.isArray(documents) && 
                    documents.length > 0;

// Decision logic
if (isLoading) return <LoadingSpinner />;
if (!isAuthenticated) return <Navigate to="/login" />;
if (!hasDocuments) return <Navigate to="/upload-documents" />;
return <Dashboard />;
```

## 🎯 Key Components

1. **useDocumentStatus Hook**: Manages document checking state
2. **DashboardGuard Component**: Protects dashboard access
3. **UploadDocuments Page**: Handles document uploads
4. **AuthProvider**: Manages authentication state
5. **API Endpoints**: Backend integration for document operations

## 🔄 Real-time Updates

```
Upload Document
      ↓
Update Local State
      ↓
Call API Upload
      ↓
Refresh Document Status
      ↓
Update Global State
      ↓
Redirect to Dashboard
```

This flow ensures that users must upload required documents before accessing the dashboard, while providing a smooth and secure user experience.
