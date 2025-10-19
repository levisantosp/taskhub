import { useNavigate } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '../lib/api.ts'

type User = {
    id: string
    email: string
    username: string
}

type AuthContextType = {
    user: User | null
    login: (email: string, pass: string) => Promise<void>
    logout: () => void
    register: (username: string, email: string, pass: string) => Promise<void>
    isAuthenticated: boolean
    isLoading: boolean
}

type LoginRes = {
    ok: boolean
    data: {
        accessToken: string
        refreshToken: string
        user: User
    }
}

type Props = {
    children: React.ReactNode
}

const Context = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('accessToken')

        if(token) {
            const payload = JSON.parse(atob(token.split('.')[1]))

            setUser({
                id: payload.sub,
                email: payload.email,
                username: payload.username
            })
        }
    }, [])

    useEffect(() => {
        if(user) {
            navigate({ to: '/tasks' })
        }
    }, [user, navigate])

    useEffect(() => {
        const token = localStorage.getItem('accessToken')

        const currentPath = window.location.pathname

        if(!token && (currentPath === '/tasks' || currentPath === '/')) {
            navigate({ to: '/login' })
        }
    }, [navigate])

    const login = async(email: string, pass: string) => {
        try {
            const res = await apiClient.post<LoginRes>('/auth/login', { email, password: pass })

            setUser(res.data.user)

            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
        }

        catch(e) {
            console.log(e)
        }

        setIsLoading(false)
    }

    const register = async(username: string, email: string, pass: string) => {
        try {
            const response = await apiClient.post<LoginRes>('/auth/register', {
                username,
                email,
                password: pass
            })

            setUser(response.data.user)

            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)

        }
        
        catch(e) {
            console.error(e)
        }
    }

    const logout = () => {
        setUser(null)

        localStorage.removeItem('accessToken')

        navigate({ to: '/login' })
    }

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
        // checkAuth
    }

    return (
        <>
            <Context
                value={value}
            >
                {children}
            </Context>
        </>
    )
}

export function useAuth() {
    const ctx = useContext(Context)

    if(!ctx) {
        throw new Error('\'useAuth\' must be used within an \'AuthProvider\'')
    }

    return ctx
}