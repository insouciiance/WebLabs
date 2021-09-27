import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:44390/api/mail',
});

export default axiosInstance;
