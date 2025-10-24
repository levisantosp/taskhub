import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button.tsx'
import { useAuth } from '../context/auth-context.tsx'
import { taskService } from '../services/tasks.service.ts'
import type { CreateTaskFormData, Task } from '@taskhub/types'
import { Modal } from '../components/ui/modal.tsx'
import { CreateTaskForm } from '../components/create-task-form.tsx'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import { Input } from '../components/ui/input.tsx'
import { Select, SelectTrigger } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectValue } from '../components/ui/select.tsx'

export default function TasksPage() {
    const auth = useAuth()

    const navigate = useNavigate()

    const [tasks, setTasks] = useState<Task[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [searchParam, setSearchParam] = useState('')
    const [statusParam, setStatus] = useState('ALL')
    const [priorityParam, setPriority] = useState('ALL')

    useEffect(() => {
        findTasks(searchParam, statusParam, priorityParam)

        const handleWebsocketMessage = (event: CustomEvent) => {
            const message = event.detail
            if (message.type === 'notification') {
                if (
                    ['task.created', 'task.updated', 'task.assigned']
                        .includes(message.payload.type)
                ) {
                    findTasks()
                }
            }
        }

        window.addEventListener('websocket.message', handleWebsocketMessage as EventListener)

        return () =>
            window.removeEventListener('websocket.message', handleWebsocketMessage as EventListener)
    }, [searchParam, statusParam, priorityParam])

    const findTasks = async (
        search = searchParam,
        status = statusParam,
        priority = priorityParam
    ) => {
        try {
            const res = await taskService.getTasks(1, 100, search, status, priority)

            setTasks(res.tasks)
        }

        catch (e) {
            console.error(e)

            toast.error('An unexpected error has occurred', {
                description: (e as Error).message
            })

            setTasks([])
        }
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setSearchParam(event.target.value)

    const handleStatusChange = (value: string) => setStatus(value)

    const handlePriorityChange = (value: string) => setPriority(value)

    const handleCreateTask = async (data: CreateTaskFormData) => {
        try {
            setIsSubmitting(true)

            await taskService.createTask({
                title: data.title,
                description: data.description,
                deadline: new Date(data.deadline).toISOString(),
                priority: data.priority,
                status: data.status
            })
            setIsModalOpen(false)

            toast.success('Task created successfully')
        } catch (e) {
            console.error(e)

            toast.error('An unexpected error has occurred', {
                description: (e as Error).message
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const goToTaskDetails = (taskId: string) => {
        navigate({ to: `/tasks/${taskId}` })
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
                            Tasks
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
                            >
                                Logout
                            </Button>
                        </div>
                    </div>

                    <div
                        className='mb-4 flex flex-col sm:flex-row gap-4 items-center'
                    >
                        <Input
                            placeholder='Search tasks by title...'
                            value={searchParam}
                            onChange={handleSearchChange}
                            className='grow'
                        />

                        <Select
                            value={statusParam}
                            onValueChange={handleStatusChange}
                            defaultValue='ALL'
                        >
                            <SelectTrigger className='w-full sm:w-[180px] text-white'>
                                <SelectValue placeholder='Filter by Status' />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value='ALL'>All Statuses</SelectItem>
                                <SelectItem value='todo'>To Do</SelectItem>
                                <SelectItem value='in_progress'>In Progress</SelectItem>
                                <SelectItem value='review'>Review</SelectItem>
                                <SelectItem value='done'>Done</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={priorityParam}
                            onValueChange={handlePriorityChange}
                            defaultValue='ALL'
                        >
                            <SelectTrigger className='w-full sm:w-[180px] text-white'>
                                <SelectValue placeholder='Filter by Priority' />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value='ALL'>All Priorities</SelectItem>
                                <SelectItem value='low'>Low</SelectItem>
                                <SelectItem value='medium'>Medium</SelectItem>
                                <SelectItem value='high'>High</SelectItem>
                                <SelectItem value='urgent'>Urgent</SelectItem>
                            </SelectContent>
                        </Select>
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
                                className='border rounded-lg p-4 mb-4 flex justify-between items-center'
                            >
                                <div>
                                    <h3
                                        className='font-semibold mb-1'
                                    >
                                        {task.title}
                                    </h3>
                                    <p
                                        className='text-gray-600 text-sm mb-2'
                                    >
                                        {task.description ? (task.description.length > 100 ? task.description.substring(0, 100) + '...' : task.description) : 'No description'}
                                    </p>
                                    <div
                                        className='flex items-center gap-2 text-xs'
                                    >
                                        <span
                                            className={`px-2 py-1 rounded ${task.status === 'TODO' ? 'bg-gray-200' :
                                                    task.status === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-800' :
                                                        task.status === 'REVIEW' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                                                }`}
                                        >
                                            {task.status.replace('_', ' ')}
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
                                <Button
                                    size='sm'
                                    onClick={() => goToTaskDetails(task.id)}
                                >
                                    View Details
                                </Button>
                            </div>
                        ))}
                        {tasks.length === 0 && (
                            <p className='text-muted-foreground text-center py-4'>No tasks found.</p>
                        )}
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