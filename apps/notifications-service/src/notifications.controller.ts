import { Controller, Get, Param, Put, Query, Headers, UnauthorizedException } from '@nestjs/common'
import { NotificationsService } from './notifications.service.ts'

@Controller('notifications')
export class NotificationsController {
    public constructor(private notification: NotificationsService) {}

    @Get(':id')
    public async getNotifications(
        @Param() { userId }: { userId: string },
        @Query('page') page = 1,
        @Query('size') size = 10
    ) {
        return await this.notification.getUserNotifications(userId, page, size)
    }

    @Get(':id/unread')
    public async getUnread(@Param() { userId }: { userId: string }) {
        return await this.notification.getUnread(userId)
    }

    @Put('read/:id')
    public async markAsRead(
        @Param() { id }: { id: string }
    ) {
        await this.notification.markAsRead(id)

        return { ok: true }
    }

    @Get(':id/read-all')
    public async markAllAsRead(@Param() { userId }: { userId: string },) {
        const { notifications } = await this.notification.getUserNotifications(userId, 1, 100)

        for(const notification of notifications) {
            if(!notification.read) {
                await this.notification.markAsRead(notification.id)
            }
        }

        return { ok: true }
    }
}