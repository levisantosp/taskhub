import { useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { taskService } from '../services/tasks.service.ts'
import type { Task } from '@taskhub/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card.tsx'
import { Button } from '../components/ui/button.tsx'
import { Modal } from '../components/ui/modal.tsx'
import EditTaskForm from '../components/edit-task-form.tsx'
import Comments from '../components/comments.tsx'
import { useAuth } from '../context/auth-context.tsx'

export default function TaskPage() {
    const { id } = useParams({ from: '/tasks/$id' })

    const [task, setTask] = useState<Task | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const auth = useAuth()

    const fetch = async() => {
        const res = await taskService.getTask(id)

        setTask(res)
    }

    useEffect(() => {
        if(!id) return

        fetch()
    }, [id])

    if(!task || !auth.user) {
        return null
    }

    return (
        <>
            <div
                className='container mx-auto p-4 max-w-3xl'
            >
                <Card>
                    <CardHeader>
                        <div
                            className='flex justify-between items-center'
                        >
                            <CardTitle
                                className='text-2xl'
                            >
                                {task.title}
                            </CardTitle>

                            <Button
                                className='text-white'
                                onClick={() => setIsModalOpen(true)}
                            >
                                Edit Task
                            </Button>
                        </div>

                        <CardDescription
                            className='flex items-center gap-4 pt-2'
                        >
                            <span
                                className={`px-2 py-1 rounded text-xs ${task.priority === 'LOW' ? 'bg-green-200' :
                                    task.priority === 'MEDIUM' ? 'bg-yellow-200' :
                                        task.priority === 'HIGH' ? 'bg-orange-200' : 'bg-red-200'
                                    }`}
                            >
                                {task.priority}
                            </span>

                            <span
                                className={`p-2 rounded text-xs ${task.status === 'TODO' ? 'bg-gray-200' :
                                    task.status === 'IN_PROGRESS' ? 'bg-blue-200' :
                                        task.status === 'REVIEW' ? 'bg-yellow-200' : 'bg-green-200'
                                    }`}
                            >
                                {task.status}
                            </span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <p
                            className='text-muted-foreground'
                        >
                            {task.description || 'No description provided.'}
                        </p>

                        <p
                            className='text-sm text-gray-500 mt-4'
                        >
                            Deadline: {new Date(task.deadline).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>

                <div
                    className='mt-8'
                >
                    <h2
                        className='text-2xl font-semibold mb-4'
                    >
                        Comments
                    </h2>

                    <Comments
                        task={task.id}
                        user={auth.user.id}
                    />
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title='Edit Task'
            >
                <EditTaskForm
                    task={task}
                    onClose={() => setIsModalOpen(false)}
                    onTaskUpdate={fetch}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                />
            </Modal>
        </>
    )
}