import { Button } from '../components/ui/button.tsx'
import { useAuth } from '../context/auth-context.tsx'

export function TasksPage() {
    const auth = useAuth()

    return (
        <div
            className='min-h-screen bg-gray-300 p-8'
        >
            <div
                className='max-w-4xl mx-auto'
            >
                <div
                    className='flex justify-between items-center mb-8'
                >
                    <h1
                        className='text-3xl font-bold'
                    >
                        My Tasks
                    </h1>

                    <div
                        className='flex items-center gap-4'
                    >
                        <span>Olá, {auth.user?.username}!</span>

                        <Button
                            onClick={auth.logout}
                            variant='outline'
                            className='text-white'
                        >
                            Sair
                        </Button>
                    </div>
                </div>

                <div
                    className='bg-white rounded-lg shadow p-6'
                >
                    <h2
                        className='text-xl font-semibold mb-4'
                    >
                        Tasks List
                    </h2>
                    
                    <p
                        className='text-gray-600'
                    >
                        TODO: Tasks Here
                    </p>
                </div>
            </div>
        </div>
    )
}