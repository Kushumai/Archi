import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || 'http://archi_backend_dev:3000',
  timeout: 5000,
});

export default axiosInstance;
