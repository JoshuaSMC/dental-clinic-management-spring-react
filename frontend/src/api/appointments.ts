import api from './axios';
import type { AppointmentDTO } from '../types';

export const getAppointments = () =>
  api.get<AppointmentDTO[]>('/appointments').then((r) => r.data);

export const getAppointmentById = (id: number) =>
  api.get<AppointmentDTO>(`/appointments/${id}`).then((r) => r.data);

export const createAppointment = (data: AppointmentDTO) =>
  api.post<AppointmentDTO>('/appointments', data).then((r) => r.data);

export const updateAppointment = (data: AppointmentDTO) =>
  api.put<AppointmentDTO>('/appointments', data).then((r) => r.data);

export const deleteAppointment = (id: number) =>
  api.delete<string>(`/appointments/${id}`).then((r) => r.data);
