import axios from "axios";
import useTokenStore from "../store/tokenStore";

const axiosInstance = axios.create({
    baseURL: "http://10.0.2.2:8000/manager",
});

//백으로 전송 전에 인터셉트함
axiosInstance.interceptors.request.use(
    (config) => {
        const token = useTokenStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//백에서 받아올 때 인터셉트함
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            useTokenStore.getState().setToken(null);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;