/**
 * Abstract Upload Service
 * Handles all file upload operations with proper authentication
 */

import { UploadOut, SignedUrlOut, PublicUrlOut } from '@/api/types';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  timeout?: number;
}

export abstract class UploadService {
  protected baseURL: string;
  protected timeout: number;

  constructor() {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    const defaultUrl = 'https://grh.sa/api';
    // const defaultUrl = 'https://iskan.thinkstudio.ai/api';
    
    // Force the correct URL for production
    if (envUrl && (envUrl.includes('172.104.226.120:2701') || envUrl.startsWith('http://'))) {
      console.warn('⚠️ Old/HTTP API URL detected in UploadService, forcing HTTPS URL');
      this.baseURL = defaultUrl;
    } else {
      this.baseURL = envUrl || defaultUrl;
    }
    
    this.timeout = 30000; // 30 seconds default
  }

  /**
   * Get the access token from localStorage
   */
  protected getAccessToken(): string {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found. Please log in again.');
    }
    return token;
  }

  /**
   * Create FormData with file and additional fields
   */
  protected createFormData(file: File, additionalData?: Record<string, any>): FormData {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }
    
    return formData;
  }

  /**
   * Make authenticated upload request
   */
  protected async uploadRequest<T>(
    endpoint: string, 
    formData: FormData, 
    options: UploadOptions = {}
  ): Promise<T> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🔑 Access Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
    console.log('📤 Upload URL:', url);
    console.log('📤 Upload Headers:', {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    });

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Don't set Content-Type - let browser set it with boundary
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload Error Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Upload Success:', result);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload timeout - please try again');
        }
        throw error;
      }
      
      throw new Error('Upload failed - please try again');
    }
  }

  /**
   * Upload user signup document
   */
  async uploadUserSignupDocument(
    file: File,
    docType: string,
    expiryDate: string,
    options: UploadOptions = {}
  ): Promise<UploadOut> {
    const formData = this.createFormData(file, {
      doc_type: docType,
      expiry_date: expiryDate,
    });

    return this.uploadRequest<UploadOut>('/uploads/documents/signup', formData, options);
  }

  /**
   * Upload residence document
   */
  async uploadResidenceDocument(
    residenceId: number,
    file: File,
    docType: string,
    expiryDate: string,
    options: UploadOptions = {}
  ): Promise<UploadOut> {
    const formData = this.createFormData(file, {
      doc_type: docType,
      expiry_date: expiryDate,
    });

    return this.uploadRequest<UploadOut>(`/uploads/documents/residence/${residenceId}`, formData, options);
  }

  /**
   * Upload residence cover photo
   */
  async uploadResidenceCover(
    residenceId: number,
    file: File,
    options: UploadOptions = {}
  ): Promise<any> {
    const formData = this.createFormData(file);

    return this.uploadRequest(`/uploads/residences/${residenceId}/cover`, formData, options);
  }

  /**
   * Upload residence gallery photo
   */
  async uploadResidenceGallery(
    residenceId: number,
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadOut> {
    const formData = this.createFormData(file);

    return this.uploadRequest<UploadOut>(`/uploads/residences/${residenceId}/gallery`, formData, options);
  }

  /**
   * Upload contract photo
   */
  async uploadContractPhoto(
    bookingId: number,
    file: File,
    commissionRate: number,
    finalPrice: number,
    startDate: string,
    endDate: string,
    options: UploadOptions = {}
  ): Promise<any> {
    const formData = this.createFormData(file, {
      commission_rate: commissionRate,
      final_price: finalPrice,
      start_date: startDate,
      end_date: endDate,
    });

    return this.uploadRequest(`/uploads/contracts/${bookingId}`, formData, options);
  }

  /**
   * Get signed URL to view a document
   */
  async getDocumentViewUrl(documentId: number): Promise<SignedUrlOut> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/documents/${documentId}/view`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get public URL for residence photo
   */
  async getResidencePhotoUrl(uploadId: number): Promise<PublicUrlOut> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/residences/photos/${uploadId}/view`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get residence cover photo URL
   */
  async getResidenceCoverPhotoUrl(residenceId: number): Promise<PublicUrlOut> {
    const url = `${this.baseURL}/uploads/residences/${residenceId}/cover-photo`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: number): Promise<void> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/documents/${documentId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }
  }

  /**
   * List user signup documents
   */
  async listUserSignupDocuments(userId: string): Promise<any> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/documents/signup/${userId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * List pending user signup documents
   */
  async listPendingUserSignupDocuments(userId: string): Promise<any> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/documents/pending_signup/${userId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * List residence private documents
   */
  async listResidencePrivateDocuments(residenceId: number): Promise<any> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/documents/${residenceId}/private-documents`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * List residence gallery photos
   */
  async listResidenceGallery(residenceId: number): Promise<any> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/residences/${residenceId}/gallery`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get contract view URL
   */
  async getContractViewUrl(contractId: number): Promise<SignedUrlOut> {
    const token = this.getAccessToken();
    const url = `${this.baseURL}/uploads/contracts/${contractId}/view`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }
}

// Export a singleton instance
export const uploadService = new UploadService();
