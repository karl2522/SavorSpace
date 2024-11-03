import axios from 'axios';

const ADMIN_API_URL = 'http://localhost:8080/auth';

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }else {
      console.warn('No token found in sessionStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('adminRefreshToken');
      if (!refreshToken) {
        // Handle missing refresh token case
        sessionStorage.removeItem('adminToken');
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${ADMIN_API_URL}/refresh-token`, { refreshToken });
        sessionStorage.setItem('adminToken', data.token);
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminRefreshToken');
        // Optionally, redirect to login page or handle the error as needed
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;