import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service.ts'
import { AuthController } from './auth.controller.ts'
import { LocalStrategy } from './strategies/local.strategy.ts'
import { JwtStrategy } from './strategies/jwt.strategy.ts'
import { BaseUser } from '@taskhub/entities'
import { RabbitMqConsumer } from './rabbitmq.consumer.ts'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT as string) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS || 'admin',
            database: process.env.DB_NAME || 'localhost',
            entities: [BaseUser],
            synchronize: true,
            logging: true
        }),
        TypeOrmModule.forFeature([BaseUser]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '30m' }
        })
    ],
    controllers: [AuthController, RabbitMqConsumer],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}