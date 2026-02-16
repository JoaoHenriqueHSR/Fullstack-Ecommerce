import axios from "axios";
import { authStorage } from "../auth/authStorage";

const apiEcommerce = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL
})

apiEcommerce.interceptors.request.use(
    (config) => {
        const token = authStorage.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para lidar com erros de autenticação
apiEcommerce.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se o token expirou ou é inválido
        if (error.response?.status === 401) {
            authStorage.removeToken();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiEcommerce;