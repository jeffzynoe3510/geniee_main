export interface UserMeasurements {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  measurements?: UserMeasurements;
}

export interface UserProfile extends User {
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}

export interface UserSession {
  user: User;
  expires: string;
} 