/**
 * UploadService Usage Examples
 * This file demonstrates how to use the UploadService for various upload operations
 */

import { uploadService } from '@/services/UploadService';

// Example 1: Upload user signup document
export async function uploadSignupDocumentExample() {
  try {
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const docType = 'هوية وطنية';
    const expiryDate = '2025-12-31';
    
    const result = await uploadService.uploadUserSignupDocument(file, docType, expiryDate);
    console.log('✅ Document uploaded successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

// Example 2: Upload residence cover photo
export async function uploadResidenceCoverExample() {
  try {
    const file = new File(['image content'], 'cover.jpg', { type: 'image/jpeg' });
    const residenceId = 123;
    
    const result = await uploadService.uploadResidenceCover(residenceId, file);
    console.log('✅ Cover photo uploaded successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

// Example 3: Upload with progress tracking
export async function uploadWithProgressExample() {
  try {
    const file = new File(['content'], 'large-file.pdf', { type: 'application/pdf' });
    const docType = 'Passport';
    const expiryDate = '2026-01-01';
    
    const result = await uploadService.uploadUserSignupDocument(file, docType, expiryDate, {
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress.percentage}%`);
      },
      timeout: 60000, // 60 seconds timeout
    });
    
    console.log('✅ Upload completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

// Example 4: Get document view URL
export async function getDocumentViewExample() {
  try {
    const documentId = 456;
    const result = await uploadService.getDocumentViewUrl(documentId);
    console.log('✅ Document view URL:', result.signed_url);
    return result;
  } catch (error) {
    console.error('❌ Failed to get view URL:', error);
    throw error;
  }
}

// Example 5: List user documents
export async function listUserDocumentsExample() {
  try {
    const userId = 'user-uuid-here';
    const result = await uploadService.listUserSignupDocuments(userId);
    console.log('✅ User documents:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to list documents:', error);
    throw error;
  }
}

// Example 6: Delete document
export async function deleteDocumentExample() {
  try {
    const documentId = 789;
    await uploadService.deleteDocument(documentId);
    console.log('✅ Document deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete document:', error);
    throw error;
  }
}

// Example 7: Upload contract photo
export async function uploadContractExample() {
  try {
    const file = new File(['contract content'], 'contract.pdf', { type: 'application/pdf' });
    const bookingId = 101;
    const commissionRate = 0.1;
    const finalPrice = 5000;
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    
    const result = await uploadService.uploadContractPhoto(
      bookingId,
      file,
      commissionRate,
      finalPrice,
      startDate,
      endDate
    );
    
    console.log('✅ Contract uploaded successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Contract upload failed:', error);
    throw error;
  }
}
