import { Module } from '@nestjs/common'
import { TasksController } from './tasks.controller.ts'
import { TasksClient } from './tasks-client.ts'

@Module({
    controllers: [TasksController],
    providers: [TasksClient]
})
export class TasksModule {}