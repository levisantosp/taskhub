import { Outlet } from '@tanstack/react-router'
import { AuthProvider } from './context/auth-context.tsx'
import Notifications from './components/notifications.tsx'
import { Toaster } from './components/ui/sonner.tsx'

export default function App() {
    return (
        <>
            <AuthProvider>
                <div
                    className='min-h-screen bg-background'
                >
                    <Outlet />
                    <Notifications />
                    <Toaster richColors position='top-right' />
                </div>
            </AuthProvider>
        </>
    )
}