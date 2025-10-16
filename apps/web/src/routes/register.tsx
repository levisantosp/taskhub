import { RegisterForm } from '../components/register-form.tsx'

export default function RegisterPage() {
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
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}