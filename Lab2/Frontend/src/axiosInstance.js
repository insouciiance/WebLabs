import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:44390/api/',
});

export default axiosInstance;
