import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx'
import { Label } from './ui/label.tsx'
import { Input } from './ui/input.tsx'
import { Button } from './ui/button.tsx'
import { useAuth } from '../context/auth-context.tsx'

const loginSchema = z.object({
    email: z.email('Invalid email!'),
    password: z.string().min(6, 'Password must have at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const auth = useAuth()

    const onSubmit = async(data: LoginFormData) => {
        await auth.login(data.email, data.password)
    }

    return (
        <>
            <Card
                className='h-full'
            >
                <CardHeader>
                    <CardTitle>Login</CardTitle>

                    <CardDescription>Log in to your account to continue</CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div
                            className='space-y-2'
                        >
                            <Label htmlFor='email' >Email</Label>

                            <Input
                                id='email'
                                type='email'
                                placeholder='your@email.com'
                                {...form.register('email')}
                            />

                            {form.formState.errors.email && (
                                <p
                                    className='text-sm text-red-400'
                                >
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div
                            className='space-y-2'
                        >
                            <Label htmlFor='password'>Password</Label>

                            <Input
                                id='password'
                                type='password'
                                placeholder='Your password'
                                {...form.register('password')}
                            />

                            {form.formState.errors.password && (
                                <p
                                    className='text-sm text-red-400'
                                >
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? 'Logging in...' : 'Log in'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}