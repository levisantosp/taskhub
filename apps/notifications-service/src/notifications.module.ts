import { Module } from '@nestjs/common'
import { RabbitMqConsumer } from './rabbitmq/rabbitmq.consumer.ts'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification, User } from '@taskhub/entities'
import { NotificationsService } from './notifications.service.ts'
import { NotificationsController } from './notifications.controller.ts'
import { NotificationsGateway } from './ws/notifications.gateway.ts'
import { dataSourceOptions } from './data-source.ts'

@Module({
    imports: [
        TypeOrmModule.forRoot(dataSourceOptions),
        TypeOrmModule.forFeature([Notification, User])
    ],
    controllers: [RabbitMqConsumer, NotificationsController],
    providers: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule { }