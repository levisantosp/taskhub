import { useNavigate } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { error } from '@taskhub/utils'
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
    isAuthenticated: boolean
}

type LoginRes = {
    accessToken: string
    refreshToken: string
    user: User
}

const Context = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('accessToken')

        if(token) {
            console.log('token found')
        }

        setUser({
            id: '1',
            email: 'email@gmail.com',
            username: 'user'
        })
    }, [])

    const testConnection = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/health')
            console.log('API Health:', response.status)
        } catch (error) {
            console.error('API não está respondendo:', error)
        }
    }

    // Chame no useEffect
    useEffect(() => {
        testConnection()
        checkAuth()
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

    const login = async (email: string, pass: string) => {
        try {
            const res = await apiClient.post<LoginRes>('/auth/login', { email, pass })

            setUser(res.user)

            localStorage.setItem('accessToken', res.accessToken)
            localStorage.setItem('refreshToken', res.refreshToken)
        }

        catch(e) {
            error(e as Error)
        }
    }

    const register = async (username: string, email: string, pass: string) => {
        try {
            const response = await apiClient.post<LoginRes>('/auth/register', {
                username,
                email,
                pass
            })

            const { accessToken, refreshToken, user } = response

            setUser(user)

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)

        }
        
        catch(e) {
            error(e as Error)
        }
    }

    const logout = () => {
        setUser(null)

        localStorage.removeItem('accessToken')

        navigate({ to: '/login' })
    }

    const checkAuth = async() => {
        const token = localStorage.getItem('accessToken')

        if(token) {
            try {
                const user = await apiClient.get<User>('/auth/me')
                setUser(user)
            }
            
            catch(e) {
                error(e as Error)
                logout()
            }
        }
    }

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        checkAuth
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