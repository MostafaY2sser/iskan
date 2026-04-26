/**
 * Uploads API endpoints
 */

import { api, request } from '../api';
import { uploadService } from '@/services/UploadService';
import type {
  UploadOut,
  SignedUrlOut,
  PublicUrlOut,
  ContractOut,
} from '../types';

export const uploadsApi = {
  // Upload user signup document
  uploadUserSignupDocument: (formData: FormData): Promise<UploadOut> => {
    // Extract data from FormData
    const file = formData.get('file') as File;
    const docType = formData.get('doc_type') as string;
    const expiryDate = formData.get('expiry_date') as string;
    
    return uploadService.uploadUserSignupDocument(file, docType, expiryDate);
  },

  // Upload user signup document (legacy method for backward compatibility)
  uploadUserDocument: (
    file: File,
    docType: string,
    expiryDate: string
  ): Promise<UploadOut> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);
    formData.append('expiry_date', expiryDate);
    
    return uploadsApi.uploadUserSignupDocument(formData);
  },

  // Upload residence document
  uploadResidenceDocument: (
    residenceId: number,
    file: File,
    docType: string,
    expiryDate: string
  ): Promise<UploadOut> => {
    return api.upload(`/uploads/documents/residence/${residenceId}`, file, {
      doc_type: docType,
      expiry_date: expiryDate,
    });
  },

  // List private documents for residence
  listResidencePrivateDocuments: (residenceId: number): Promise<any> => {
    return api.get(`/uploads/documents/${residenceId}/private-documents`);
  },

  // View document
  viewDocument: (documentId: number): Promise<SignedUrlOut> => {
    return uploadService.getDocumentViewUrl(documentId);
  },

  // List user signup documents
  listUserSignupDocuments: (userId: string): Promise<{ results: UploadOut[] }> => {
    return uploadService.listUserSignupDocuments(userId);
  },

  // List pending user signup documents
  listPendingUserSignupDocuments: (userId: string): Promise<any> => {
    return api.get(`/uploads/documents/pending_signup/${userId}`);
  },

  // Delete document
  deleteDocument: (documentId: number): Promise<void> => {
    return uploadService.deleteDocument(documentId);
  },

  // Delete user document (alias for deleteDocument)
  deleteUserDocument: (documentId: number): Promise<void> => {
    return uploadsApi.deleteDocument(documentId);
  },

  // View user document (alias for viewDocument)
  viewUserDocument: (documentId: number): Promise<SignedUrlOut> => {
    return uploadsApi.viewDocument(documentId);
  },

  // Upload residence cover photo
  uploadResidenceCover: (residenceId: number, file: File): Promise<any> => {
    return api.upload(`/uploads/residences/${residenceId}/cover`, file);
  },

  // Upload residence gallery photo
  uploadResidenceGallery: (residenceId: number, file: File): Promise<UploadOut> => {
    return api.upload(`/uploads/residences/${residenceId}/gallery`, file);
  },

  // List residence gallery
  listResidenceGallery: (residenceId: number): Promise<any> => {
    return api.get(`/uploads/residences/${residenceId}/gallery`);
  },

  // View residence photo
  viewResidencePhoto: (uploadId: number): Promise<PublicUrlOut> => {
    return api.get(`/uploads/residences/photos/${uploadId}/view`);
  },

  // Upload contract photo
  uploadContractPhoto: (
    bookingId: number,
    file: File,
    commissionRate: number,
    finalPrice: number,
    startDate: string,
    endDate: string
  ): Promise<ContractOut> => {
    return api.upload(`/uploads/contracts/${bookingId}`, file, {
      commission_rate: commissionRate,
      final_price: finalPrice,
      start_date: startDate,
      end_date: endDate,
    });
  },

  // View contract
  viewContract: (contractId: number): Promise<SignedUrlOut> => {
    return api.get(`/uploads/contracts/${contractId}/view`);
  },

  // Get residence cover photo
  getResidenceCoverPhoto: (residenceId: number): Promise<PublicUrlOut> => {
    return api.get(`/uploads/residences/${residenceId}/cover-photo`);
  },
};
