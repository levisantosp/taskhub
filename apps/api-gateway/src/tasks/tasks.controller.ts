import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    Request,
    UseGuards
} from '@nestjs/common'
import { TasksClient } from './tasks-client.ts'
import { firstValueFrom } from 'rxjs'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.ts'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateComment } from './dto/create-comment.dto.ts'
import { CreateTask } from './dto/create-task.dto.ts'
import { UpdateTask } from './dto/update-task.dto.ts'

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    public constructor(private readonly task: TasksClient) {}

    @Get()
    public async findAll(
        @Query('page') page = 1,
        @Query('size') size = 10
    ) {
        return await firstValueFrom(this.task.send('find.tasks', { page, size }))
    }

    @Get(':id')
    public async getTask(@Param('id') id: string) {
        return await firstValueFrom(this.task.send('find.task', { id }))
    }

    @Post()
    public async createTask(
        @Body() data: CreateTask,
        @Request() req: any
    ) {
        return await firstValueFrom(this.task.send('create.task', {
            ...data,
            createdBy: req.user.userId
        }))
    }

    @Put(':id')
    public async updateTask(
        @Param('id') id: string,
        @Body() data: UpdateTask
    ) {
        return await firstValueFrom(this.task.send('update.task', { id, ...data }))
    }

    @Delete(':id')
    public async deleteTask(@Param('id') id: string) {
        return await firstValueFrom(this.task.send('delete.task', { id }))
    }

    @Get(':id/comments')
    public async getComments(
        @Param('id') id: string,
        @Query('page') page = 1,
        @Query('size') size = 10
    ) {
        return await firstValueFrom(this.task.send('find.comments', { id, page, size }))
    }

    @Post(':id/comments')
    public async createComment(
        @Param('id', ParseUUIDPipe) taskId: string,
        @Body() comment: CreateComment,
        @Request() req: any
    ) {
        return await firstValueFrom(this.task.send('task.create.comment', {
            ...comment,
            createdBy: req.user.userId,
            taskId
        }))
    }
}
