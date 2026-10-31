import type { DetectionRecord } from './detection';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  createdAt: string | null;
}

export interface AppState {
  user: AuthUser | null;
}

export type UserRole = 'authenticated' | 'guest';

export type { DetectionRecord, PredictionResponse } from './detection';