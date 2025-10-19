import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { TasksClient } from './tasks-client.ts'
import { firstValueFrom } from 'rxjs'

@Controller('tasks')
export class TasksController {
    public constructor(private readonly task: TasksClient) {}

    @Get()
    public async findAll(
        @Query('page') page = 1,
        @Query('size') size = 10
    ) {
        try {
            return await firstValueFrom(this.task.send('find.tasks', { page, size }))
        }

        catch(e) {
            throw new Error((e as Error).message)
        }
    }

    @Get(':id')
    public async getTask(@Param('id') id: string) {
        try {
            return await firstValueFrom(this.task.send('get.task', { id }))
        }

        catch(e) {
            throw new Error((e as Error).message)
        }
    }

    @Post()
    public async createTask(@Body() data: unknown) {
        try {
            return await firstValueFrom(this.task.send('create.task', data))
        }

        catch(e) {
            throw new Error((e as Error).message) 
        }
    }

    @Put(':id')
    public async updateTask(@Param('id') id: string, @Body() data: any) {
        try {
            return await firstValueFrom(this.task.send('update.task', { id, ...data }))
        }

        catch(e) {
            throw new Error((e as Error).message) 
        }
    }

    @Delete(':id')
    public async deleteTask(@Param('id') id: string) {
        try {
            return await firstValueFrom(this.task.send('delete.task', { id }))
        }

        catch(e) {
            throw new Error((e as Error).message) 
        }
    }

    @Get(':id/comments')
    public async getComments(
        @Param('id') id: string,
        @Query('page') page = 1,
        @Query('size') size = 10
    ) {
        try {
            return await firstValueFrom(this.task.send('get.comments', { id, page, size }))
        }

        catch(e) {
            throw new Error((e as Error).message) 
        }
    }
}