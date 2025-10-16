import { LoginForm } from '../components/login-form.tsx'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-300 flex flex-col">
            <div className='flex justify-center items-center pt-10'>
                <h1 className='text-5xl font-bold text-center'>
                    Login
                </h1>
            </div>

            <div
                className='flex justify-center pt-10'
            >
                <div 
                    className='w-full max-w-sm p-8 bg-white rounded-lg shadow-lg'
                >
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}