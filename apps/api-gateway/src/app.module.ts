import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module.ts'
import { TasksModule } from './tasks/tasks.module.ts'

@Module({
    imports: [AuthModule, TasksModule]
})
export class AppModule {}