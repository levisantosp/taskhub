import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button.tsx'
import { useAuth } from '../context/auth-context.tsx'
import { taskService } from '../services/tasks.service.ts'
import type { CreateTaskFormData, Task } from '@taskhub/types'
import { Modal } from '../components/ui/modal.tsx'
import { CreateTaskForm } from '../components/create-task-form.tsx'

export default function TasksPage() {
    const auth = useAuth()

    const [tasks, setTasks] = useState<Task[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        findTasks()
    }, [])

    const findTasks = async () => {
        const res = await taskService.getTasks()

        setTasks(res.tasks)
    }

    const handleCreateTask = async (data: CreateTaskFormData) => {
        setIsSubmitting(true)

        await taskService.createTask({
            task: {
                ...data,
                assignedUsersId: [auth.user?.id],
                createdBy: auth.user?.id
            },
            author: auth.user?.id
        })

        await findTasks()

        setIsModalOpen(false)
    }

    return (
        <>
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
                            <span>Howdy, {auth.user?.username}!</span>

                            <Button onClick={() => setIsModalOpen(true)}>
                                Create a new task
                            </Button>

                            <Button
                                onClick={auth.logout}
                                variant='outline'
                                className='text-white'
                            >
                                Logout
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

                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className='border rounded-2xl p-4'
                            >
                                <h3
                                    className='font-semibold'
                                >
                                    {task.title}
                                </h3>

                                <p
                                    className='text-gray-600'
                                >
                                    {task.description}
                                </p>

                                <div
                                    className='flex justify-between items-center'
                                >
                                    <span
                                        className={`p-2 rounded text-xs ${task.status === 'TODO' ? 'bg-gray-200' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-200' :
                                                task.status === 'REVIEW' ? 'bg-yellow-200' : 'bg-green-200'
                                            }`}
                                    >
                                        {task.status}
                                    </span>

                                    <span
                                        className={`px-2 py-1 rounded text-xs ${task.priority === 'LOW' ? 'bg-green-200' :
                                            task.priority === 'MEDIUM' ? 'bg-yellow-200' :
                                                task.priority === 'HIGH' ? 'bg-orange-200' : 'bg-red-200'
                                            }`}
                                    >
                                        {task.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='New Task'
            >
                <CreateTaskForm
                    onSubmit={handleCreateTask}
                    isSubmitting={isSubmitting}
                />
            </Modal>
        </>
    )
}