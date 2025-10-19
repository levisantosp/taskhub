import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Label } from './ui/label.tsx'
import { Input } from './ui/input.tsx'
import { Textarea } from './ui/textarea.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx'
import type { TaskPriority, TaskStatus } from '@taskhub/types'
import { Button } from './ui/button.tsx'

const taskSchema = z.object({
    title: z.string().min(1, 'Title must be provided'),
    description: z.string().optional(),
    deadline: z.string().min(1, 'Deadline must be provided'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
})

type TaskFormData = z.infer<typeof taskSchema>

type Props = {
    onSubmit: (data: TaskFormData) => Promise<void>
    isSubmitting: boolean
}

export function CreateTaskForm(props: Props) {
    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            status: 'TODO',
            priority: 'MEDIUM'
        }
    })

    return (
        <>
            <form
                onSubmit={form.handleSubmit(props.onSubmit)}
                className='space-y-4'
            >
                <div
                    className='space-y-2'
                >
                    <Label htmlFor='title'>Title</Label>

                    <Input
                        id='title'
                        placeholder='Task Title'
                        {...form.register('title')}
                    />

                    {form.formState.errors.title && (
                        <p
                            className='text-sm text-red-500'
                        >
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                <div
                    className='space-y-2'
                >
                    <Label htmlFor='description'>Description (optional)</Label>

                    <Textarea
                        id='description'
                        placeholder='Task Description'
                        {...form.register('description')}
                    />
                </div>

                <div
                    className='grid grid-cols-2 gap-4'
                >
                    <div
                        className='space-y-2 text-white'
                    >
                        <Label
                            htmlFor='priority'
                            className='text-black'
                        >
                            Priority
                        </Label>

                        <Select
                            onValueChange={(value: TaskPriority) => form.setValue('priority', value)}
                            defaultValue='MEDIUM'
                        >
                            <SelectTrigger>
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
                        <Label
                            htmlFor='status'
                            className='text-black'
                        >
                            Status
                        </Label>

                        <Select
                            onValueChange={(value: TaskStatus) => form.setValue('status', value)}
                            defaultValue='TODO'
                        >
                            <SelectTrigger>
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

                <div
                    className='space-y-2'
                >
                    <Label htmlFor='deadline'>Deadline</Label>

                    <Input
                        id='deadline'
                        type='date'
                        {...form.register('deadline')}
                    />

                    {form.formState.errors.deadline && (
                        <p
                            className='text-sm text-red-500'
                        >
                            {form.formState.errors.deadline.message}
                        </p>
                    )}
                </div>

                <Button
                    type='submit'
                    className='w-full'
                    disabled={props.isSubmitting}
                >
                    {props.isSubmitting ? 'Creating...' : 'Create Task'}
                </Button>
            </form>
        </>
    )
}