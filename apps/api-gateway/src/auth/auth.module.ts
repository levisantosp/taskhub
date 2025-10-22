import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller.ts'
import { AuthClient } from './auth-client.ts'
import { JwtStrategy } from './jwt.strategy.ts'
import { JwtAuthGuard } from './jwt-auth.guard.ts'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

@Module({
    controllers: [AuthController],
    providers: [AuthClient, JwtStrategy, JwtAuthGuard],
    exports: [JwtAuthGuard],
    imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async(config: ConfigService) => ({
                secret: config.get<string>('JWT_ACCESS_TOKEN')
            })
        })
    ]
})
export class AuthModule {}