import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { TasksService } from '../tasks.service.ts'
import { UpdateTask } from '../dto/update-task.dto.ts'
import { CreateTask } from '../dto/create-task.dto.ts'
import { CreateComment } from '../dto/create-comment.dto.ts'

@Controller()
export class RabbitMQConsumer {
    public constructor(private readonly task: TasksService) {}

    @MessagePattern('find.tasks')
    public async findAll(
        data: {
            page: number,
            size: number
        }
    ) {
        try {
            const result = await this.task.findAll(data.page, data.size)

            return { ok: true, data: result }
        }

        catch(e) {
            return { ok: false, error: (e as Error).message }
        }
    }

    @MessagePattern('find.task')
    public async findUnique(id: string) {
        try {
            const result = await this.task.findUnique(id)

            return { ok: true, data: result }
        }

        catch(e) {
            return { ok: false, error: (e as Error).message }
        }
    }

    @MessagePattern('create.task')
    public async createTask(
        data: {
            task: CreateTask,
            author: string
        }
    ) {
        try {
            const result = await this.task.create(data.task, data.author)

            return { ok: true, data: result }
        }

        catch(e) {
            return { ok: false, error: (e as Error).message }
        }
    }

    @MessagePattern('update.task')
    public async updateTask(
        data: {
            task: string
            data: UpdateTask,
            changedBy: string
        }
    ) {
        try {
            const result = await this.task.update(data.task, data.data, data.changedBy)

            return { ok: true, data: result }
        }

        catch(e) {
            return { ok: false, error: (e as Error).message }
        }
    }

    @MessagePattern('delete.task')
    public async deleteTask(
        data: {
            task: string
        }
    ) {
        try {
            const result = await this.task.delete(data.task)

            return { ok: true, data: result }
        }

        catch(e) {
            return { ok: false, error: (e as Error).message }
        }
    }

    @MessagePattern('find.comments')
    public async findComments(
        data: {
            task: string
            page: number
            size: number
        }
    ) {
        try {
            const result = await this.task.findComments(data.task, data.page, data.size)

            return { ok: true, data: result }
        }

        catch(e) {
            return { ok: false, error: (e as Error).message }
        }
    }

    @MessagePattern('create.comment')
    public async createComment(
        data: {
            task: string
            comment: CreateComment
        }
    ) {
        try {
            const result = await this.task.createComment(data.task, data.comment)

            return { ok: true, data: result }
        }

        catch(e) {
            return { ok: false, error: (e as Error).message }
        }
    }
}