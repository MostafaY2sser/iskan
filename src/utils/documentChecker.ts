/**
 * Document Checker Utility
 * Provides various methods to check if user has uploaded documents
 */

import { uploadService } from '@/services/UploadService';

export interface DocumentCheckResult {
  hasDocuments: boolean;
  documents: any[];
  count: number;
  error?: string;
}

export interface DocumentInfo {
  id: number;
  file_path: string;
  entity_type: string;
  entity_id: number;
  uploaded_at: string;
}

/**
 * Check if user has uploaded any documents
 */
export async function checkUserDocuments(userId: string): Promise<DocumentCheckResult> {
  try {
    const response = await uploadService.listUserSignupDocuments(userId);
    
    const hasDocuments = response?.results?.length > 0;
    const documents = response?.results || [];
    
    return {
      hasDocuments,
      documents,
      count: documents.length
    };
  } catch (error) {
    console.error('Error checking documents:', error);
    return {
      hasDocuments: false,
      documents: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Simple boolean check for uploaded documents
 */
export async function hasUploadedFiles(userId: string): Promise<boolean> {
  try {
    const result = await checkUserDocuments(userId);
    return result.hasDocuments;
  } catch (error) {
    console.error('Error checking files:', error);
    return false;
  }
}

/**
 * Get document count for user
 */
export async function getDocumentCount(userId: string): Promise<number> {
  try {
    const result = await checkUserDocuments(userId);
    return result.count;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
}

/**
 * Get detailed document information
 */
export async function getDocumentDetails(userId: string): Promise<DocumentInfo[]> {
  try {
    const result = await checkUserDocuments(userId);
    return result.documents;
  } catch (error) {
    console.error('Error getting document details:', error);
    return [];
  }
}

/**
 * Check if user has specific document type
 */
export async function hasDocumentType(userId: string, docType: string): Promise<boolean> {
  try {
    const documents = await getDocumentDetails(userId);
    return documents.some(doc => 
      doc.file_path.toLowerCase().includes(docType.toLowerCase())
    );
  } catch (error) {
    console.error('Error checking document type:', error);
    return false;
  }
}

/**
 * Get documents by type
 */
export async function getDocumentsByType(userId: string, docType: string): Promise<DocumentInfo[]> {
  try {
    const documents = await getDocumentDetails(userId);
    return documents.filter(doc => 
      doc.file_path.toLowerCase().includes(docType.toLowerCase())
    );
  } catch (error) {
    console.error('Error getting documents by type:', error);
    return [];
  }
}

/**
 * Check document upload status with detailed logging
 */
export async function checkDocumentStatusWithLogging(userId: string): Promise<DocumentCheckResult> {
  console.log('🔍 Checking document status for user:', userId);
  
  try {
    const result = await checkUserDocuments(userId);
    
    if (result.hasDocuments) {
      console.log('✅ Documents found:', {
        count: result.count,
        documents: result.documents.map(doc => ({
          id: doc.id,
          type: doc.entity_type,
          uploaded: doc.uploaded_at
        }))
      });
    } else {
      console.log('❌ No documents found for user');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error checking document status:', error);
    return {
      hasDocuments: false,
      documents: [],
      count: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate if user can access dashboard (has required documents)
 */
export async function canAccessDashboard(userId: string): Promise<{
  canAccess: boolean;
  reason?: string;
  documentCount: number;
}> {
  try {
    const result = await checkUserDocuments(userId);
    
    if (result.error) {
      return {
        canAccess: false,
        reason: `Error checking documents: ${result.error}`,
        documentCount: 0
      };
    }
    
    if (!result.hasDocuments) {
      return {
        canAccess: false,
        reason: 'No documents uploaded',
        documentCount: 0
      };
    }
    
    return {
      canAccess: true,
      documentCount: result.count
    };
  } catch (error) {
    return {
      canAccess: false,
      reason: `Failed to check documents: ${error}`,
      documentCount: 0
    };
  }
}
