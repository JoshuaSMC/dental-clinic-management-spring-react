export interface Dentist {
  id?: number;
  name: string;
  lastName: string;
  registration: number;
}

export interface Address {
  id?: number;
  street: string;
  number: number;
  location: string;
  province: string;
}

export interface Patient {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  cardIdentity?: number;
  admissionDate?: string;
  address?: Address;
}

export interface AppointmentDTO {
  id?: number;
  patientId: number;
  dentistId: number;
  date: string;
  time: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserDTO {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface JwtPayload {
  sub: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}
