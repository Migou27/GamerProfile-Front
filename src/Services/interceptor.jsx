import axios from "axios";
import { infoToast } from './alertHandler/alertHandler';
import i18next from 'i18next';

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized")
            infoToast(i18next.t('Auth-SessionExpired'))
            localStorage.removeItem("token")
        }
        return Promise.reject(error)
    }
)