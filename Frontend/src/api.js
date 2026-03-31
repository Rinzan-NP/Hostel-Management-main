import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const hostelApi = {
  // Halls
  getHalls: () => api.get('halls/'),
  getHall: (id) => api.get(`halls/${id}/`),
  createHall: (data) => api.post('halls/', data),

  // Rooms
  getRooms: () => api.get('rooms/'),
  createRoom: (data) => api.post('rooms/', data),
  
  // Students
  getStudents: () => api.get('students/'),
  createStudent: (data) => api.post('students/', data),

  // Assignments
  createAssignment: (data) => api.post('assignments/', data),

  // Rents
  getRents: () => api.get('rents/'),
  updateRent: (id, data) => api.patch(`rents/${id}/`, data),
};

export default api;
