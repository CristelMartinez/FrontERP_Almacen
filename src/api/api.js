import axios from "axios"
import toast from "react-hot-toast"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

/* 🔹 INTERCEPTOR DE REQUEST */
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* 🔹 INTERCEPTOR DE RESPONSE */
api.interceptors.response.use(
  (response) => response,
  (error) => {

    const status = error.response?.status
    const url = error.config?.url

    // 🔥 NO aplicar en login
    if (url?.includes("/auth/login")) {
      return Promise.reject(error)
    }

    if (status === 401 || status === 403) {

      toast.error("Sesión expirada, inicia sesión nuevamente")

      setTimeout(() => {
        localStorage.removeItem("token")
        window.location.href = "/"
      }, 1500)
    }

    return Promise.reject(error)
  }
)

export default api