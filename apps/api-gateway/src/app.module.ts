import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module.ts'
import { TasksModule } from './tasks/tasks.module.ts'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { ApiWebSocketGateWay } from './ws/websocket.gateway.ts'

@Module({
    imports: [
        AuthModule,
        TasksModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 1,
                    limit: 10
                }
            ]
        })
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        ApiWebSocketGateWay
    ]
})
export class AppModule {}