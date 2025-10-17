import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller.ts'
import { AuthClient } from './auth-client.ts'
import { JwtStrategy } from './jwt.strategy.ts'
import { JwtAuthGuard } from './jwt-auth.guard.ts'

@Module({
    controllers: [AuthController],
    providers: [AuthClient, JwtStrategy, JwtAuthGuard],
    exports: [AuthClient]
})
export class AuthModule {}