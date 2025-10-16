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

export interface TaskCreatedEvent {
    type: 'task.created'
    payload: {
        id: string
        title: string
        description: string
        createdBy: string
        assignedUsers: string[]
        createdAt: Date
    }
}

export interface TaskUpdatedEvent {
    type: 'task.updated'
    payload: {
        id: string
        title: string
        description: string
        status: string
        priority: string
        updatedAt: Date
        changedBy: string
    }
}

export interface TaskCommentCreatedEvent {
    type: 'task.comment.created'
    payload: {
        id: string
        content: string
        taskId: string
        authorId: string
        createdAt: Date
    }
}

export type BaseRabbitMQEVent = TaskCreatedEvent | TaskUpdatedEvent | TaskCommentCreatedEvent

export type RabbitMQEvent<T extends BaseRabbitMQEVent = BaseRabbitMQEVent> = T