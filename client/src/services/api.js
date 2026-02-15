import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (user && user.access_token) {
            config.headers.Authorization = `Bearer ${user.access_token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api
