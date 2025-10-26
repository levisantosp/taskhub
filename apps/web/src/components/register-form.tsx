import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.tsx'
import { Label } from './ui/label.tsx'
import { Input } from './ui/input.tsx'
import { Button } from './ui/button.tsx'
import { useAuth } from '../context/auth-context.tsx'

const registerSchema = z.object({
    email: z.email('Invalid email!'),
    password: z.string()
        .min(6, 'Password must have at least 6 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/\d/, 'Password must contain at least one number'),
    username: z.string()
        .min(3, 'Username must have at least 3 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    confirmPassword: z.string()
})
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    const auth = useAuth()

    const onSubmit = async(data: RegisterFormData) => {
        await auth.register(data.username, data.email, data.password)
    }

    return (
        <>
            <Card
                className='h-full'
            >
                <CardHeader>
                    <CardTitle>Register</CardTitle>

                    <CardDescription>Register to use the system</CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div
                            className='space-y-2'
                        >
                            <Label htmlFor='username'>Username</Label>

                            <Input
                                id='username'
                                placeholder='YourUsername'
                                {...form.register('username')}
                            />

                            {form.formState.errors.username && (
                                <p
                                    className='text-sm text-red-400'
                                >
                                    {form.formState.errors.username.message}
                                </p>
                            )}
                        </div>

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

                        <div
                            className='space-y-2'
                        >
                            <Label htmlFor='confirmPassword'>Confirm password</Label>

                            <Input
                                id='confirmPassword'
                                type='password'
                                placeholder='Confirm password'
                                {...form.register('confirmPassword')}
                            />

                            {form.formState.errors.confirmPassword && (
                                <p
                                    className='text-sm text-red-400'
                                >
                                    {form.formState.errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type='submit'
                            className='w-full'
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}