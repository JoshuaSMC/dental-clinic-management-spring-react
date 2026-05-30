import api from './axios';
import type { UserDTO, RegisterRequest, AuthResponse } from '../types';

export const getUsers = () =>
  api.get<UserDTO[]>('/api/users').then((r) => r.data);

export const createUser = (data: RegisterRequest) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const deleteUser = (id: number) =>
  api.delete<string>(`/api/users/${id}`).then((r) => r.data);
