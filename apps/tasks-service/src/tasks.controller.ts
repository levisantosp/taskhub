import { Controller, ValidationPipe } from '@nestjs/common'
import { TasksService } from './tasks.service.ts'
import { CreateTask } from './dto/create-task.dto.ts'
import { UpdateTask } from './dto/update-task.dto.ts'
import { CreateComment } from './dto/create-comment.dto.ts'
import { MessagePattern, Payload } from '@nestjs/microservices'

@Controller()
export class TasksController {
    public constructor(private readonly task: TasksService) {}

    @MessagePattern('create.task')
    public async create(@Payload(new ValidationPipe()) createTask: CreateTask) {
        return await this.task.create(createTask, createTask.createdBy)
    }

    @MessagePattern('find.tasks')
    public async findMany(
        @Payload(new ValidationPipe()) payload: {
            page: number
            size: number
            priority?: string
            status?: string
            search?: string
        }
    ) {
        return await this.task.findMany(payload.page, payload.size, payload.search, payload.status, payload.priority)
    }

    @MessagePattern('find.task')
    public async findUnique(@Payload() payload: { id: string }) {
        return await this.task.findUnique(payload.id)
    }

    @MessagePattern('update.task')
    public async update(@Payload(new ValidationPipe()) payload: UpdateTask & { id: string }) {
        const { id, ...data } = payload

        return await this.task.update(id, data, data.changedBy)
    }

    @MessagePattern('delete.task')
    public async delete(@Payload() payload: { id: string }) {
        return await this.task.delete(payload.id)
    }

    @MessagePattern('task.create.comment')
    public async createComment(@Payload(new ValidationPipe()) payload: CreateComment & { taskId: string }) {
        const { taskId, ...data } = payload
        
        return await this.task.createComment(taskId, data)
    }

    @MessagePattern('find.comments')
    public async findComments(
        @Payload() payload: {
            taskId: string
            page: number
            size: number
        }
    ) {
        return await this.task.findComments(payload.taskId, payload.page, payload.size)
    }
}