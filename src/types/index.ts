export type Role = 'student' | 'teacher' | 'staff' | 'admin';

export type Zone = 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro';

export type StandStatus = 'active' | 'inactive' | 'saturated' | 'recommended' | 'moderate';

export interface Stand {
  id: string;
  name: string;
  group: string;
  tema: string;
  zone: Zone;
  description: string;
  materials?: string;
  objective?: string;
  status: StandStatus;
  currentVisitors: number;
  totalVisitors: number;
  totalPoints?: number;
  qrSlug: string; // Unique identifier for generating QR codes for each stand
  trivia?: TriviaQuestion[];
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface UserSession {
  token: string;
  role: Role;
  name: string;
  lastName: string;
  group: string;
  expiresAt: number;
}

export interface StandProgress {
  standId: string;
  visitedAt?: number;
  arrivedAt?: number;
  score?: number;
}
