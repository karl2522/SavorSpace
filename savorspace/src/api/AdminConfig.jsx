import axios from 'axios';

const ADMIN_API_URL = 'http://localhost:8080/admin';

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Corrected string interpolation for Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
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
      const refreshToken = localStorage.getItem('refreshToken');
      try {
        // Corrected string interpolation for refresh token endpoint
        const { data } = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
        localStorage.setItem('authToken', data.token);
        // Corrected string interpolation for Authorization header
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // Optionally, redirect to login page or handle the error as needed
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;