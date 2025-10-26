import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service.ts'
import { AuthController } from './auth.controller.ts'
import { LocalStrategy } from './strategies/local.strategy.ts'
import { JwtStrategy } from './strategies/jwt.strategy.ts'
import { BaseUser } from '@taskhub/entities'
import { RabbitMqConsumer } from './rabbitmq.consumer.ts'
import { dataSourceOptions } from './data-source.ts'
import { HealthModule } from './health/health.module.ts'

@Module({
    imports: [
        TypeOrmModule.forRoot(dataSourceOptions),
        TypeOrmModule.forFeature([BaseUser]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '30m' }
        }),
        HealthModule
    ],
    controllers: [AuthController, RabbitMqConsumer],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}