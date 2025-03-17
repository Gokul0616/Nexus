import axios from 'axios';
import {backendUrl} from './EndPoint';
import {storage} from '../../Components/CommonData';

const apiClient = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: ['application/json', 'multipart/form-data'],
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = storage.getString('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('Request config:', config);
    return config;
  },
  error => {
    // console.error('Request error:', error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  response => {
    // console.log('Response:', response);
    return response;
  },
  error => {
    // console.error('Response error:', error);
    if (error.response && error.response.status === 401) {
      // console.warn('Unauthorized! Redirecting to login...');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
