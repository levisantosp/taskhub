import { Module } from '@nestjs/common'
import { TasksController } from './tasks.controller.ts'
import { TasksClient } from './tasks-client.ts'
import { AuthModule } from '../auth/auth.module.ts'

@Module({
    controllers: [TasksController],
    providers: [TasksClient],
    imports: [AuthModule]
})
export class TasksModule {}