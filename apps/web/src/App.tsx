// import './App.css'
import { Outlet } from '@tanstack/react-router'
import { AuthProvider } from './context/auth-context.tsx'

export default function App() {
    return (
        <>
            <AuthProvider>
                <div
                    className='min-h-screen bg-background'
                >
                    <Outlet />
                </div>
            </AuthProvider>
        </>
    )
}