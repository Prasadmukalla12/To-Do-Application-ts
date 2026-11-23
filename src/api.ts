import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:4000",
})

const tokenKey = "appointment-session"

export function saveSession(token: string) {
    sessionStorage.setItem(tokenKey, token)
}

export async function endSession() {
    try {
        if (sessionStorage.getItem(tokenKey)) await api.post("/logout", undefined, { timeout: 4000 })
    } catch {
        // Clear the browser session even when the server is unreachable.
    } finally {
        sessionStorage.removeItem(tokenKey)
    }
}

api.interceptors.request.use(config => {
    const token = sessionStorage.getItem(tokenKey)
    if (token) config.headers.set("Authorization", `Bearer ${token}`)
    return config
})

export default api
