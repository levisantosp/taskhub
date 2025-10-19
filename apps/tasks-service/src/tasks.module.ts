import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksService } from './tasks.service.ts'
import { Task, User, Comment, TaskHistory } from '@taskhub/entities'
import { TasksController } from './tasks.controller.ts'
import { RabbitMqService } from './rabbitmq/rabbitmq.service.ts'
import { RabbitMQConsumer } from './rabbitmq/rabbitmq.consumer.ts'

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
            synchronize: true,
            logging: true
        }),
        TypeOrmModule.forFeature([Task, User, Comment, TaskHistory])
    ],
    controllers: [TasksController, RabbitMQConsumer],
    providers: [TasksService, RabbitMqService]
})
export class TasksModule {}