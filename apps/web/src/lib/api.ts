const API_BASE_URL = 'http://localhost:3001'

const api = async<T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = API_BASE_URL + endpoint

    const token = localStorage.getItem('accessToken')

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    }

    const res = await fetch(url, config)

    if(!res.ok) {
        if(res.status === 401) {
            localStorage.removeItem('accessToken')

            window.location.href = '/login'
        }

        throw new Error(`HTTP error: ${res.status}`)
    }

    return await res.json()
}

export const apiClient = {
    get: <T>(endpoint: string) => api<T>(endpoint),
    post: <T>(endpoint: string, data?: unknown) =>
        api<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    put: <T>(endpoint: string, data?: unknown) =>
        api<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    delete: <T>(endpoint: string) =>
        api<T>(endpoint, {
            method: 'DELETE'
        })
}