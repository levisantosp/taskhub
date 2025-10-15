export interface User {
    id: string
    email: string
    username: string
    createdAt: Date
    updatedAt: Date
}

export interface Task {
    id: string
    title: string
    description: string
    deadline: Date
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
    assignedUsers: User[]
    createdBy: User
    createdAt: Date
    updatedAt: Date
}

export interface Comment {
    id: string
    content: string
    task: Task
    author: User
    createdAt: Date
}

export interface AuthPayload {
    userId: string
    email: string
}

export type TaskEvent =
    | 'task.created'
    | 'task.updated'
    | 'task.comment.created'

export interface RabbitMQEvent {
    type: TaskEvent
    payload: any
    timestamp: Date
}