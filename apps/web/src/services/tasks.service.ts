import type { Comment, Task } from '@taskhub/types'
import { apiClient } from '../lib/api.ts'

type Pagination = {
    page: number
    size: number
    total: number
    totalPages: number
}
type ApiTasksResponse = {
    tasks: Task[]
    pagination: Pagination
}

type ApiCommentsResponse = {
    comments: Comment[]
    pagination: Pagination
}

export const taskService = {
    getTasks: async (
        page = 1,
        size = 10,
        search = '',
        status = 'all',
        priority = 'all'
    ) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        })

        if(search.length) params.append('search', search)

        if(status !== 'all') params.append('status', status)

        if(priority !== 'all') params.append('priority', priority)

        return await apiClient.get<ApiTasksResponse>(`/tasks?${params.toString()}`)
    },
    getTask: async (id: string) =>
        await apiClient.get<Task>(`/tasks/${id}`),
    createTask: async (data: unknown) =>
        await apiClient.post('/tasks', data),
    updateTask: async (id: string, data: unknown) =>
        await apiClient.put(`/tasks/${id}`, data),
    deleteTask: async (id: string) =>
        await apiClient.delete(`/tasks/${id}`),
    getComments: async (taskId: string, page = 1, size = 10) =>
        await apiClient.get<ApiCommentsResponse>(`/tasks/${taskId}/comments?page=${page}&size=${size}`),
    createComment: async<T extends string>(taskId: string, content: T) =>
        await apiClient.post(`/tasks/${taskId}/comments`, { content })
}