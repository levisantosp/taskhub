import { zodResolver } from '@hookform/resolvers/zod'
import type { Task, TaskPriority, TaskStatus } from '@taskhub/types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { taskService } from '../services/tasks.service.ts'
import { Label } from './ui/label.tsx'
import { Input } from './ui/input.tsx'
import { Textarea } from './ui/textarea.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx'
import { Button } from './ui/button.tsx'

const formSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    deadline: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']).optional()
})

type FormSchema = z.infer<typeof formSchema>

type Props = {
    task: Task
    onTaskUpdate: () => void
    onClose: () => void
    isSubmitting: boolean
    setIsSubmitting: (is: boolean) => void
}

export default function EditTaskForm(props: Props) {
    const [_, setIsOpen] = useState(false)

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: props.task.title,
            description: props.task.description ?? '',
            priority: props.task.priority,
            status: props.task.status
        }
    })

    const onSubmit = async(data: FormSchema) => {
        await taskService.updateTask(props.task.id, data)

        props.onClose()
        props.onTaskUpdate()

        setIsOpen(false)

        // TODO: maybe add success and error notification
    }

    return (
        <>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 pt-4'
            >
                <div className='space-y-2'>
                    <Label htmlFor='edit-title'>Title</Label>
                    <Input
                        id='edit-title'
                        placeholder='Task Title'
                        {...form.register('title')}
                    />
                    {form.formState.errors.title && (
                        <p className='text-sm text-red-500'>
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='edit-description'>Description (optional)</Label>
                    <Textarea
                        id='edit-description'
                        placeholder='Task Description'
                        {...form.register('description')}
                    />
                </div>

                <div
                    className='grid grid-cols-2 gap-4 text-white'
                >
                    <div className='space-y-2'>
                        <Label htmlFor='edit-priority' className='text-black'>
                            Priority
                        </Label>
                        <Select
                            onValueChange={(value: TaskPriority) => form.setValue('priority', value)}
                            defaultValue={form.getValues('priority')}
                        >
                            <SelectTrigger id='edit-priority'>
                                <SelectValue placeholder='Select the priority' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='LOW'>Low</SelectItem>
                                <SelectItem value='MEDIUM'>Medium</SelectItem>
                                <SelectItem value='HIGH'>High</SelectItem>
                                <SelectItem value='URGENT'>Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div
                        className='space-y-2 text-white'
                    >
                        <Label htmlFor='edit-status' className='text-black'>
                            Status
                        </Label>
                        <Select
                            onValueChange={(value: TaskStatus) => form.setValue('status', value)}
                            defaultValue={form.getValues('status')}
                        >
                            <SelectTrigger id='edit-status'>
                                <SelectValue placeholder='Select the status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='TODO'>To do</SelectItem>
                                <SelectItem value='IN_PROGRESS'>In Progress</SelectItem>
                                <SelectItem value='REVIEW'>Review</SelectItem>
                                <SelectItem value='DONE'>Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='edit-deadline'>Deadline</Label>
                    <Input
                        id='edit-deadline'
                        type='date'
                        {...form.register('deadline')}
                    />
                    {form.formState.errors.deadline && (
                        <p className='text-sm text-red-500'>
                            {form.formState.errors.deadline.message}
                        </p>
                    )}
                </div>

                <div className='flex justify-end gap-2 pt-4'>
                    <Button
                        type='button'
                        onClick={props.onClose}
                        className='text-white'
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        disabled={props.isSubmitting}
                    >
                        {props.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </>
    )
}