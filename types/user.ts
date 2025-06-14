export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  preferences?: UserPreferences;
  measurements?: UserMeasurements;
  skinType?: 'normal' | 'dry' | 'oily' | 'combination';
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}

export interface UserMeasurements {
  height?: number;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  inseam?: number;
  shoulder?: number;
  sleeve?: number;
  lastUpdated?: string;
}

export interface UserSession {
  user: User;
  expires: string;
} 