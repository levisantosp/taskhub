import { Module } from '@nestjs/common'
import { RabbitMqConsumer } from './rabbitmq/rabbitmq.consumer.ts'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification, User } from '@taskhub/entities'
import { NotificationsService } from './notifications.service.ts'
import { NotificationsController } from './notifications.controller.ts'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT as string) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS || 'admin',
            database: process.env.DB_NAME || 'localhost',
            entities: [Notification],
            synchronize: true,
            logging: true
        }),
        TypeOrmModule.forFeature([Notification, User])
    ],
    controllers: [RabbitMqConsumer, NotificationsController],
    providers: [NotificationsService]
})
export class NotificationsModule {}