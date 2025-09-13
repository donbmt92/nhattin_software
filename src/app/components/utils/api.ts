import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080/api', // Default to NestJS backend
});

// Thêm interceptor để đính kèm token nếu có
api.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem('nhattin_token'); // Hoặc lấy từ cookie nếu bạn đang sử dụng cookie
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để log response
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.log('API Response Error:', error.response);
            if (error.response.status == 401) {
                // Xóa token từ localStorage
                localStorage.removeItem('nhattin_token');
                // Hoặc nếu bạn sử dụng cookies, bạn có thể xóa cookie tại đây

                // Chuyển hướng đến trang đăng nhập hoặc home
                window.location.href = '/'; // Thay đổi đường dẫn nếu cần
            }
        } else {
            console.log('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
