import api from './axios';
import type { Patient } from '../types';

export const getPatients = () =>
  api.get<Patient[]>('/patients').then((r) => r.data);

export const getPatientById = (id: number) =>
  api.get<Patient>(`/patients/${id}`).then((r) => r.data);

export const createPatient = (data: Patient) =>
  api.post<Patient>('/patients', data).then((r) => r.data);

export const updatePatient = (data: Patient) =>
  api.put<Patient>('/patients', data).then((r) => r.data);

export const deletePatient = (id: number) =>
  api.delete<string>(`/patients/${id}`).then((r) => r.data);
