export type Language = 'bn' | 'en';

export type BookingType = 'standard' | 'permanent';

export type ApplicationStatus = 'submitted' | 'under_review' | 'processing' | 'completed' | 'rejected';

export interface RequiredDocumentDef {
  id: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  isMandatory: boolean;
  acceptedFormats: string[]; // ['.jpg', '.jpeg', '.png', '.pdf']
}

export interface ServiceItem {
  id: string;
  category: 'aadhaar' | 'pan' | 'voter' | 'ration' | 'ayushman' | 'epfo' | 'dl' | 'other';
  titleBn: string;
  titleEn: string;
  shortDescBn: string;
  shortDescEn: string;
  subServicesBn: string[];
  subServicesEn: string[];
  requiredDocs: RequiredDocumentDef[];
  isPopular?: boolean;
  permanentBookingAvailable: boolean;
}

export interface UploadedDoc {
  docId: string;
  docName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileData?: string; // Base64 data preview or secure storage reference
  uploadedAt: string;
}

export interface ApplicationRecord {
  id: string; // e.g. AOC-2026-XXXX
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceCategory: string;
  serviceTitle: string;
  subService: string;
  bookingType: BookingType;
  status: ApplicationStatus;
  statusNote?: string;
  notes?: string;
  applicantDetails: Record<string, string>;
  documents: UploadedDoc[];
  whatsappNotificationStatus: 'pending' | 'sent' | 'not_configured';
  consentAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  address?: string;
  language?: Language;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  applicationId?: string;
  title: string;
  message: string;
  type: 'status_update' | 'application_submitted' | 'system';
  read: boolean;
  createdAt: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  whatsapp: string;
  rawWhatsappNumber: string;
  landmark: string;
  pincode: string;
  state: string;
}
