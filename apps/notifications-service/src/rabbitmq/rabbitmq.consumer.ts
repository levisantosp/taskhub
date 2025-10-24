import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import type {
    RabbitMQEvent,
    TaskCommentCreatedEvent,
    TaskCreatedEvent,
    TaskUpdatedEvent
} from '@taskhub/types'
import { NotificationsService } from '../notifications.service.ts'
import { NotificationsGateway } from '../ws/notifications.gateway.ts'

@Controller()
export class RabbitMqConsumer {
    public constructor(
        private notification: NotificationsService,
        private ws: NotificationsGateway
    ) {}

    @MessagePattern('task.created')
    public async handleTaskCreated(@Payload() data: RabbitMQEvent<TaskCreatedEvent>) {
        for(const user of data.assignedUsers) {
            const notification = await this.notification.create({
                type: 'task.assigned',
                title: 'New assigned task',
                message: `You have been assigned to task "${data.title}"`,
                userId: user,
                metadata: {
                    task: data.id,
                    title: data.title
                }
            })

            this.ws.sendTo(user, 'notification', notification)
        }

        if(!data.assignedUsers.includes(data.createdBy)) {
            const notification = await this.notification.create({
                type: 'task.created',
                title: 'Task created',
                message: `You created the task "${data.title}"`,
                userId: data.createdBy,
                metadata: {
                    task: data.id,
                    title: data.title
                }
            })

            this.ws.sendTo(data.createdBy, 'notification', notification)
        }
    }

    @MessagePattern('task.updated')
    public async handleTaskUpdated(@Payload() data: RabbitMQEvent<TaskUpdatedEvent>) {
        const notification = await this.notification.create({
            type: 'task.updated',
            title: 'Task updated',
            message: `You updated the task "${data.title}"`,
            userId: data.changedBy,
            metadata: {
                task: data.id,
                title: data.title
            }
        })

        this.ws.sendTo(data.changedBy, 'notification', notification)
    }

    @MessagePattern('task.comment.created')
    public async handleTaskCommendCreated(@Payload() data: RabbitMQEvent<TaskCommentCreatedEvent>) {
        const notification = await this.notification.create({
            type: 'task.updated',
            title: 'Task updated',
            message: `New comment on task: "${data.content}"`,
            userId: data.authorId,
            metadata: {
                task: data.taskId,
                comment: data.id
            }
        })

        this.ws.sendTo(data.authorId, 'notification', notification)
    }
}