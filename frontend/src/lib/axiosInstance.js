import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "api/",
  withCredentials: true, 
});

export default axiosInstance;

let refreshPromise = null;

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config || {};

		if (originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axiosInstance(originalRequest);
				}

				refreshPromise = axiosInstance.post('/auth/refresh');
				await refreshPromise;
				refreshPromise = null;

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				refreshPromise = null;
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);