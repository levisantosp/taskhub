export interface User {
    id: string
    email: string
    username: string
    createdAt: Date
    updatedAt: Date
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'

export interface Task {
    id: string
    title: string
    description: string
    deadline: Date
    priority: TaskPriority
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
    assignedUsers: string[]
    createdBy: User
    createdAt: Date
    updatedAt: Date
}

export interface CreateTaskData {
    title: string
    description: string
    deadline: string
    priority: TaskPriority
    assignedUsers: string[]
}

export interface CreateTaskFormData {
    title: string
    description?: string
    deadline: string
    priority: TaskPriority
    status: TaskStatus
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
    status?: TaskStatus
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
    id: string
    title: string
    description: string
    createdBy: string
    assignedUsers: string[]
    createdAt: Date
}

export interface TaskUpdatedEvent {
    id: string
    title: string
    description: string
    status: string
    priority: string
    updatedAt: Date
    changedBy: string
}

export interface TaskCommentCreatedEvent {
    id: string
    content: string
    taskId: string
    author: User
    createdAt: Date
}

export type BaseRabbitMQEVent = TaskCreatedEvent | TaskUpdatedEvent | TaskCommentCreatedEvent

export type RabbitMQEvent<T extends BaseRabbitMQEVent = BaseRabbitMQEVent> = T