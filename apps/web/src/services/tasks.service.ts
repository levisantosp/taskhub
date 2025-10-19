import { apiClient } from '../lib/api.ts'

type ApiResponse = {
    ok: boolean
    data: any
}

export const taskService = {
    getTasks: async(page = 1, size = 10) =>
        await apiClient.get<ApiResponse>(`/tasks?page=${page}&size=${size}`),
    getTask: async(id: string) =>
        await apiClient.get<ApiResponse>(`/tasks/${id}`),
    createTask: async(data: unknown) =>
        await apiClient.post('/tasks', data),
    updateTask: async(id: string, data: unknown) =>
        await apiClient.put(`/tasks/${id}`, data),
    deleteTask: async(id: string) =>
        await apiClient.delete(`/tasks/${id}`),
    getComments: async(taskId: string, page = 1, size = 10) =>
        await apiClient.get(`/tasks/${taskId}/comments?page=${page}&size=${size}`),
    createComment: async<T extends string>(taskId: string, content: T) =>
        await apiClient.post(`/tasks/${taskId}/comments`, { content })
}