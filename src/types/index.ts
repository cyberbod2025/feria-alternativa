export type Role = 'student' | 'teacher' | 'staff' | 'admin';

export type Zone = 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro';

export type StandStatus = 'active' | 'inactive' | 'saturated' | 'recommended' | 'moderate';

export type ConnectionStatus = 'real' | 'demo' | 'offline';

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
  qrSlug: string;
  trivia?: TriviaQuestion[];
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface UserSession {
  sub?: string;
  role: Role;
  module?: string;
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

export interface SessionResponse {
  valid: boolean;
  session?: UserSession;
  error?: string;
}
