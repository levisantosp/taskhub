import { zodResolver } from '@hookform/resolvers/zod'
import type { Comment } from '@taskhub/types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { taskService } from '../services/tasks.service.ts'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form.tsx'
import { Textarea } from './ui/textarea.tsx'
import { Button } from './ui/button.tsx'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

const commentSchema = z.object({ content: z.string().min(1, 'Comment needs to be provided') })

type CommentSchema = z.infer<typeof commentSchema>

type Props = {
    task: string
    user: string
}

export default function Comments(props: Props) {
    const [comments, setComments] = useState<Comment[]>([])

    const form = useForm<CommentSchema>({
        resolver: zodResolver(commentSchema),
        defaultValues: { content: '' }
    })

    const fetch = async() => {
        const res = await taskService.getComments(props.task, 1, 100)

        setComments(res.comments)
    }

    const navigate = useNavigate()

    useEffect(() => {
        fetch()

        const handleWebsocketMessage = (event: CustomEvent) => {
            const message = event.detail

            if(
                message.type === 'notification'
                && message.payload.metadata.task === props.task
                && message.payload.userId !== props.user
            ) {
                if(message.payload.type === 'task.comment.created') {
                    fetch()
                }

                toast.info(message.payload.title, {
                    description: message.payload.message,
                    action: {
                        label: 'View',
                        onClick: () => navigate({ to: `/tasks/${props.task}` })
                    },
                    duration: 10000
                })
            }
        }

        window.addEventListener('websocket.message', handleWebsocketMessage as EventListener)

        return () =>
            window.removeEventListener('websocket.message', handleWebsocketMessage as EventListener)
    }, [props.task])

    const onSubmit = async(data: CommentSchema) => {
        try {
            await taskService.createComment(props.task, data.content)

            form.reset()

            await fetch()

            toast.success('Comment added successfully')
        }

        catch(e) {
            console.error(e)

            toast.error('An unexpected error has occurred', {
                description: (e as Error).message
            })
        }

        // TODO: SUCCESSFULL TOAST
    }

    return (
        <>
            <div className='space-y-6'>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-3'
                    >
                        <FormField
                            control={form.control}
                            name='content'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='sr-only'>New Comment</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Add a comment...'
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type='submit'
                            disabled={form.formState.isSubmitting}
                            size='sm'
                        >
                            {form.formState.isSubmitting ? 'Commenting...' : 'Comment'}
                        </Button>
                    </form>
                </Form>

                <div className='space-y-4'>
                    {!comments.length && (
                        <p className='text-muted-foreground text-center'>
                            No comments yet.
                        </p>
                    )}

                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className='flex items-start gap-3 p-4 border rounded-lg'
                        >
                            <div
                                className='flex-1'
                            >
                                <div
                                    className='flex justify-between items-center mb-1'
                                >
                                    <span
                                        className='font-medium text-sm'
                                    >
                                        {comment.author.username}
                                    </span>
                                    <span
                                        className='text-xs text-muted-foreground'
                                    >
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p
                                    className='text-sm text-muted-foreground'
                                >
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}