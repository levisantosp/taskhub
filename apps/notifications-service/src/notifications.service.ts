import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notification } from '@taskhub/entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NotificationsService {
    public constructor(
        @InjectRepository(Notification)
        private notification: Repository<Notification>
    ) {}

    public async create(data: NotificationData) {
        const notification = this.notification.create(data)

        return await this.notification.save(notification)
    }

    public async getUserNotifications(user: string, page = 1, size = 10) {
        const [notifications, total] = await this.notification.findAndCount({
            where: {
                userId: user
            },
            order: {
                createdAt: 'DESC'
            },
            skip: (page - 1) * size,
            take: size
        })

        return {
            notifications,
            pagination: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size)
            }
        }
    }

    public async getUnread(user: string) {
        let { notifications } = await this.getUserNotifications(user, 1, 100)

        notifications = notifications.filter(n => !n.read)

        return {
            count: notifications.length,
            notifications
        }
    }

    public async markAsRead(notification: string) {
        return await this.notification.update(notification, { read: true })
    }
}

type NotificationData = {
    type: string
    title: string
    message: string
    userId: string
    metadata: any
}