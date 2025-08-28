import axios from "axios";
import useTokenStore from "../store/tokenStore";
import useUrlStore from "../store/urlStore";

const BaseUrl = useUrlStore.getState().BaseUrl;
const axiosInstance = axios.create({
    baseURL: BaseUrl,
});

//백으로 전송 전에 인터셉트함
axiosInstance.interceptors.request.use(
    (config) => {
        if (config.url.startsWith("/manager") || config.url.startsWith("/static")) {
            const token = useTokenStore.getState().token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }
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
        if (
            error.response?.status === 401 &&
            (error.response.config.url.startsWith("/manager") ||
                error.response.config.url.startsWith("/static"))
        ) {
            useTokenStore.getState().setToken(null);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
