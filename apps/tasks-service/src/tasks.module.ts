import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity.ts'
import { TasksService } from './tasks.service.ts'
import { Task } from './entities/task.entity.ts'
import { Comment } from './entities/comment.entity.ts'
import { TaskHistory } from './entities/history.entity.ts'
import { TasksController } from './tasks.controller.ts'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT as string) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS || 'admin',
            database: process.env.DB_NAME || 'localhost',
            entities: [Task, User, Comment, TaskHistory],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: true
        }),
        TypeOrmModule.forFeature([Task, User, Comment, TaskHistory])
    ],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule {}