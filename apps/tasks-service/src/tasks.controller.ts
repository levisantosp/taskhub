import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { TasksService } from './tasks.service.ts'
import { CreateTask } from './dto/create-task.dto.ts'
import { UpdateTask } from './dto/update-task.dto.ts'
import { CreateComment } from './dto/create-comment.dto.ts'

@Controller('tasks')
export class TasksController {
    public constructor(private readonly task: TasksService) {}

    @Post()
    public async create(@Body() createTask: CreateTask) {
        return await this.task.create(createTask, createTask.createdBy)
    }

    @Get()
    public async findAll(
        @Query('page') page = 1,
        @Query('size') size = 10
    ) {
        return await this.task.findAll(page, size)
    }

    @Get(':id')
    public async findUnique(@Param() { id }: { id: string }) {
        return await this.task.findUnique(id)
    }

    @Put(':id')
    public async update(
        @Param() { id }: { id: string },
        @Body() updateTask: UpdateTask
    ) {
        return await this.task.update(id, updateTask, updateTask.changedBy)
    }

    @Delete(':id')
    public async delete(@Param() { id }: { id: string }) {
        return await this.task.delete(id)
    }

    @Post(':taskId/comments')
    public async createComment(
        @Param('taskId') taskId: string,
        @Body() createComment: CreateComment
    ) {
        return await this.task.createComment(taskId, createComment)
    }

    @Get(':id/comments')
    public async findComments(
        @Param('id') taskId: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 10
    ) {
        return await this.task.findComments(taskId, page, size)
    }
}