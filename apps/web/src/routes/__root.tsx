import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from '../App.tsx'
import LoginPage from './login.tsx'
import RegisterPage from './register.tsx'
import { TasksPage } from './tasks.tsx'

const root = createRootRoute({ component: App })

const index = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <div>Home Page</div>
})

const login = createRoute({
    getParentRoute: () => root,
    path: '/login',
    component: () => <LoginPage />
})

const register = createRoute({
    getParentRoute: () => root,
    path: '/register',
    component: () => <RegisterPage />
})

const tasks = createRoute({
    getParentRoute: () => root,
    path: '/tasks',
    component: () => <TasksPage />
})

const routeTree = root.addChildren([index, login, register, tasks])

export const router = createRouter({ routeTree })