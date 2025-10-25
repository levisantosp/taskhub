import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
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
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from '@nestjs/swagger'
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
    @ApiOperation({ summary: 'List tasks with pagination and filters' })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)'
    })
    @ApiQuery({
        name: 'size',
        required: false,
        type: Number,
        description: 'Items per page (default: 10)'
    })
    @ApiQuery({
        name: 'search',
        required: false,
        type: String,
        description: 'Search term for title/description'
    })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: ['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
        description: 'Filter by status (default: ALL)'
    })
    @ApiQuery({
        name: 'priority',
        required: false,
        enum: ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        description: 'Filter by priority (default: ALL)'
    })
    @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    public async findMany(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
        @Query('search', new DefaultValuePipe('')) search: string,
        @Query('status', new DefaultValuePipe('ALL')) status: string,
        @Query('priority', new DefaultValuePipe('ALL')) priority: string
    ) {
        return await firstValueFrom(this.task.send('find.tasks', { page, size, status, priority, search }))
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single task by ID' })
    @ApiParam({ name: 'id', type: String, description: 'UUID of the task' })
    @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    public async getTask(@Param('id', ParseUUIDPipe) id: string) {
        return await firstValueFrom(this.task.send('find.task', { id }))
    }

    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'Task created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request (Validation Error)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
    @ApiOperation({ summary: 'Update an existing task' })
    @ApiParam({ name: 'id', type: String, description: 'UUID of the task to update' })
    @ApiResponse({ status: 200, description: 'Task updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request (Validation Error)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    public async updateTask(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() data: UpdateTask,
        @Request() req: any
    ) {
        const changedBy = req.user.userId

        return await firstValueFrom(this.task.send('update.task', { id, ...data, changedBy }))
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task' })
    @ApiParam({ name: 'id', type: String, description: 'UUID of the task to delete' })
    @ApiResponse({ status: 200, description: 'Task deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    public async deleteTask(@Param('id', ParseUUIDPipe) id: string) {
        return await firstValueFrom(this.task.send('delete.task', { id }))
    }

    @Get(':id/comments')
    @ApiOperation({ summary: 'List comments for a task' })
    @ApiParam({ name: 'id', type: String, description: 'UUID of the task' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'size', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    public async getComments(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
    ) {
        return await firstValueFrom(this.task.send('find.comments', { taskId: id, page, size }))
    }

    @Post(':id/comments')
    @ApiOperation({ summary: 'Add a comment to a task' })
    @ApiParam({ name: 'id', type: String, description: 'UUID of the task to comment on' })
    @ApiResponse({ status: 201, description: 'Comment created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request (Validation Error)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Task not found' })
    public async createComment(
        @Param('id', ParseUUIDPipe) taskId: string,
        @Body() comment: CreateComment,
        @Request() req: any
    ) {
        return await firstValueFrom(this.task.send('task.create.comment', {
            ...comment,
            authorId: req.user.userId,
            taskId: taskId
        }))
    }
}