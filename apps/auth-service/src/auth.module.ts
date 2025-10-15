import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { User } from './entities/user.entity.ts'
import { AuthService } from './auth.service.ts'
import { AuthController } from './auth.controller.ts'
import { LocalStrategy } from './strategies/local.strategy.ts'
import { JwtStrategy } from './strategies/jwt.strategy.ts'

console.log('=== ENV VARIABLES ===')
console.log('DB_HOST:', process.env.DB_HOST)
console.log('DB_PORT:', process.env.DB_PORT)
console.log('DB_USER:', process.env.DB_USER)
console.log('DB_PASS:', process.env.DB_PASS)
console.log('DB_NAME:', process.env.DB_NAME)
console.log('=====================')

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT as string) || 5432,
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASS || 'admin',
            database: process.env.DB_NAME || 'localhost',
            entities: [User],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: true
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '30m' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}