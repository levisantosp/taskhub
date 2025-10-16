import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import type { RabbitMQEvent, TaskCommentCreatedEvent, TaskCreatedEvent, TaskUpdatedEvent } from '@taskhub/types'
import { NotificationsService } from '../notifications.service.ts'

@Controller()
export class RabbitMqConsumer {
    public constructor(private notification: NotificationsService) {}

    @MessagePattern('task.created')
    public async handleTaskCreated(@Payload() data: RabbitMQEvent<TaskCreatedEvent>) {
        for(const user of data.payload.assignedUsers) {
            await this.notification.create({
                type: 'task.assigned',
                title: 'New assigned task',
                message: `You have been assigned to task "${data.payload.title}"`,
                userId: user,
                metadata: {
                    task: data.payload.id,
                    title: data.payload.title
                }
            })
        }

        if(!data.payload.assignedUsers.includes(data.payload.createdBy)) {
            await this.notification.create({
                type: 'task.created',
                title: 'Task created',
                message: `You created the task "${data.payload.title}"`,
                userId: data.payload.createdBy,
                metadata: {
                    task: data.payload.id,
                    title: data.payload.title
                }
            })
        }
    }

    @MessagePattern('task.updated')
    public async handleTaskUpdated(@Payload() data: RabbitMQEvent<TaskUpdatedEvent>) {
        await this.notification.create({
            type: 'task.updated',
            title: 'Task updated',
            message: `You updated the task "${data.payload.title}"`,
            userId: data.payload.changedBy,
            metadata: {
                task: data.payload.id,
                title: data.payload.title
            }
        })
    }

    @MessagePattern('task.comment.created')
    public async handleTaskCommendCreated(@Payload() data: RabbitMQEvent<TaskCommentCreatedEvent>) {
        await this.notification.create({
            type: 'task.updated',
            title: 'Task updated',
            message: `New comment on task: "${data.payload.content}"`,
            userId: data.payload.authorId,
            metadata: {
                task: data.payload.taskId,
                comment: data.payload.id
            }
        })
    }
}