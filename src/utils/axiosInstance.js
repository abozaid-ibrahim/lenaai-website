import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.lenaai.net',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // console.log("request", config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
    //     return config;
    // },
    // (error) => {
    //     return Promise.reject(error);
    // }
);

export default axiosInstance;