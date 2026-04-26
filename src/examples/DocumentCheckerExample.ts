/**
 * Document Checker Usage Examples
 * Shows different ways to check if user has uploaded documents
 */

import { 
  checkUserDocuments, 
  hasUploadedFiles, 
  getDocumentCount, 
  getDocumentDetails,
  hasDocumentType,
  getDocumentsByType,
  checkDocumentStatusWithLogging,
  canAccessDashboard
} from '@/utils/documentChecker';

// Example 1: Basic document check
export async function basicDocumentCheck() {
  const userId = 'user-uuid-here';
  
  const result = await checkUserDocuments(userId);
  
  if (result.hasDocuments) {
    console.log(`✅ User has ${result.count} documents uploaded`);
    console.log('Documents:', result.documents);
  } else {
    console.log('❌ No documents uploaded');
    if (result.error) {
      console.log('Error:', result.error);
    }
  }
  
  return result;
}

// Example 2: Simple boolean check
export async function simpleBooleanCheck() {
  const userId = 'user-uuid-here';
  
  const hasFiles = await hasUploadedFiles(userId);
  
  if (hasFiles) {
    console.log('✅ User has uploaded files');
  } else {
    console.log('❌ No files uploaded');
  }
  
  return hasFiles;
}

// Example 3: Get document count
export async function getDocumentCountExample() {
  const userId = 'user-uuid-here';
  
  const count = await getDocumentCount(userId);
  console.log(`📊 User has ${count} documents`);
  
  return count;
}

// Example 4: Get detailed document information
export async function getDocumentDetailsExample() {
  const userId = 'user-uuid-here';
  
  const documents = await getDocumentDetails(userId);
  
  console.log('📄 Document Details:');
  documents.forEach((doc, index) => {
    console.log(`${index + 1}. ID: ${doc.id}`);
    console.log(`   File: ${doc.file_path}`);
    console.log(`   Type: ${doc.entity_type}`);
    console.log(`   Uploaded: ${doc.uploaded_at}`);
    console.log('---');
  });
  
  return documents;
}

// Example 5: Check for specific document type
export async function checkSpecificDocumentType() {
  const userId = 'user-uuid-here';
  
  // Check if user has uploaded national ID
  const hasNationalId = await hasDocumentType(userId, 'national_id');
  
  if (hasNationalId) {
    console.log('✅ User has uploaded National ID');
  } else {
    console.log('❌ No National ID uploaded');
  }
  
  return hasNationalId;
}

// Example 6: Get documents by type
export async function getDocumentsByTypeExample() {
  const userId = 'user-uuid-here';
  
  // Get all passport documents
  const passportDocs = await getDocumentsByType(userId, 'passport');
  
  console.log(`📘 Found ${passportDocs.length} passport documents:`);
  passportDocs.forEach(doc => {
    console.log(`- ${doc.file_path} (uploaded: ${doc.uploaded_at})`);
  });
  
  return passportDocs;
}

// Example 7: Check with detailed logging
export async function checkWithLogging() {
  const userId = 'user-uuid-here';
  
  const result = await checkDocumentStatusWithLogging(userId);
  
  return result;
}

// Example 8: Dashboard access validation
export async function validateDashboardAccess() {
  const userId = 'user-uuid-here';
  
  const access = await canAccessDashboard(userId);
  
  if (access.canAccess) {
    console.log(`✅ User can access dashboard (${access.documentCount} documents)`);
  } else {
    console.log(`❌ User cannot access dashboard: ${access.reason}`);
  }
  
  return access;
}

// Example 9: React component usage
export function DocumentStatusComponent() {
  const [hasDocuments, setHasDocuments] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkDocuments() {
      try {
        setLoading(true);
        const userId = 'current-user-id'; // Get from auth context
        const result = await checkUserDocuments(userId);
        setHasDocuments(result.hasDocuments);
        setError(result.error || null);
      } catch (err) {
        setError('Failed to check documents');
        setHasDocuments(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkDocuments();
  }, []);
  
  if (loading) {
    return <div>Checking documents...</div>;
  }
  
  if (error) {
    return <div>Error: {error}</div>;
  }
  
  if (hasDocuments) {
    return <div>✅ Documents uploaded successfully!</div>;
  } else {
    return <div>❌ Please upload your documents</div>;
  }
}

// Example 10: Complete document validation flow
export async function completeDocumentValidation(userId: string) {
  console.log('🔍 Starting complete document validation...');
  
  // Step 1: Check if user has any documents
  const hasFiles = await hasUploadedFiles(userId);
  if (!hasFiles) {
    return {
      valid: false,
      message: 'No documents uploaded',
      action: 'redirect_to_upload'
    };
  }
  
  // Step 2: Get document count
  const count = await getDocumentCount(userId);
  console.log(`📊 Found ${count} documents`);
  
  // Step 3: Check for required document types
  const hasNationalId = await hasDocumentType(userId, 'national_id');
  const hasPassport = await hasDocumentType(userId, 'passport');
  
  const missingDocs = [];
  if (!hasNationalId) missingDocs.push('National ID');
  if (!hasPassport) missingDocs.push('Passport');
  
  if (missingDocs.length > 0) {
    return {
      valid: false,
      message: `Missing required documents: ${missingDocs.join(', ')}`,
      action: 'upload_missing_documents',
      missingDocuments: missingDocs
    };
  }
  
  // Step 4: Validate dashboard access
  const dashboardAccess = await canAccessDashboard(userId);
  
  return {
    valid: dashboardAccess.canAccess,
    message: dashboardAccess.canAccess ? 'All documents valid' : dashboardAccess.reason,
    action: dashboardAccess.canAccess ? 'allow_dashboard_access' : 'redirect_to_upload',
    documentCount: count,
    hasNationalId,
    hasPassport
  };
}
