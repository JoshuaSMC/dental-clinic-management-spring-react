import api from './axios';
import type { Dentist } from '../types';

export const getDentists = () =>
  api.get<Dentist[]>('/odontologos').then((r) => r.data);

export const getDentistById = (id: number) =>
  api.get<Dentist>(`/odontologos/${id}`).then((r) => r.data);

export const createDentist = (data: Dentist) =>
  api.post<Dentist>('/odontologos', data).then((r) => r.data);

export const updateDentist = (data: Dentist) =>
  api.put<Dentist>('/odontologos', data).then((r) => r.data);

export const deleteDentist = (id: number) =>
  api.delete<string>(`/odontologos/${id}`).then((r) => r.data);
