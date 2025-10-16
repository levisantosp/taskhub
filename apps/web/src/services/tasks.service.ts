import { apiClient } from '../lib/api.ts'

export const taskService = {
    getTasks: (page = 1, size = 10) => apiClient.get(`/tasks?page=${page}&size=${size}`),
    getTask: (id: string) => apiClient.get(`/tasks/${id}`),
    createTask: (data: unknown) => apiClient.post('/tasks', data),
    updateTask: (id: string, data: unknown) => apiClient.put(`/tasks/${id}`, data),
    deleteTask: (id: string) => apiClient.delete(`/tasks/${id}`),
    getComments: (taskId: string, page = 1, size = 10) => apiClient.get(`/tasks/${taskId}/comments?page=${page}&size=${size}`),
    createComment: <T extends string>(taskId: string, content: T) => apiClient.post(`/tasks/${taskId}/comments`, { content })
}