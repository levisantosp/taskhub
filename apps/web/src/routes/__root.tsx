import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from '../App.tsx'
import LoginPage from './login.tsx'
import RegisterPage from './register.tsx'
import TasksPage from './tasks.tsx'
import TaskPage from './task.tsx'

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

const task = createRoute({
    getParentRoute: () => root,
    path: '/tasks/$id',
    component: () => <TaskPage />
})

const routeTree = root.addChildren([index, login, register, tasks, task])

export const router = createRouter({ routeTree })