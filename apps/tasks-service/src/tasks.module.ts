import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TasksService } from './tasks.service.ts'
import { Task, User, Comment, TaskHistory } from '@taskhub/entities'
import { TasksController } from './tasks.controller.ts'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { dataSourceOptions } from './data-source.ts'

@Module({
    imports: [
        TypeOrmModule.forRoot(dataSourceOptions),
        TypeOrmModule.forFeature([Task, User, Comment, TaskHistory]),
        ClientsModule.register([
            {
                name: 'notifications.queue',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
                    queue: 'notifications.queue',
                    queueOptions: { durable: true }
                }
            }
        ])
    ],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule { }