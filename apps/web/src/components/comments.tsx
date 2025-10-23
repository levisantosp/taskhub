import { zodResolver } from '@hookform/resolvers/zod'
import type { Comment } from '@taskhub/types'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { taskService } from '../services/tasks.service.ts'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form.tsx'
import { Textarea } from './ui/textarea.tsx'
import { Button } from './ui/button.tsx'

const commentSchema = z.object({ content: z.string().min(1, 'Comment needs to be provided') })

type CommentSchema = z.infer<typeof commentSchema>

type Props = {
    task: string
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

    useEffect(() => {
        fetch()
    }, [props.task])

    const onSubmit = async(data: CommentSchema) => {
        console.log(data)

        await taskService.createComment(props.task, data.content)

        form.reset()

        await fetch()
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