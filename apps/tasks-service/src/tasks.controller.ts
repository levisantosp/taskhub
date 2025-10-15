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
        // TODO: get user id from jwt
        return this.task.create(createTask, 'temp-id')
    }

    @Get()
    public async findAll(
        @Query('page') page = 1,
        @Query('size') size = 10
    ) {
        return this.task.findAll(page, size)
    }

    @Get(':id')
    public async findUnique(@Param() id: string) {
        return this.task.findUnique(id)
    }

    @Put(':id')
    public async update(
        @Param() id: string,
        @Body() updateTask: UpdateTask
    ) {
        // TODO: get user id from jwt
        return this.task.update(id, updateTask, 'temp-id')
    }

    @Delete(':id')
    public async delete(@Param() id: string) {
        return this.task.delete(id)
    }

    @Post(':id/comments')
    async addComment(@Body() createCommentDto: CreateComment) {
        return this.task.createComment(createCommentDto)
    }

    @Get(':id/comments')
    async findComments(
        @Param('id') taskId: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 10
    ) {
        return this.task.findComments(taskId, page, size)
    }
}