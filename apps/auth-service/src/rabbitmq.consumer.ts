import { Controller, ValidationPipe } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AuthService } from './auth.service.ts'
import { RegisterDto } from './dto/register.dto.ts'
import { LoginDto } from './dto/login.dto.ts'

@Controller()
export class RabbitMqConsumer {
    public constructor(private readonly auth: AuthService) {}

    @MessagePattern('register')
    public async register(@Payload(new ValidationPipe()) data: RegisterDto) {
        try {
            const result = await this.auth.register(data)
            return { ok: true, data: result }
        }
        
        catch(error) {
            return { ok: true, error }
        }
    }

    @MessagePattern('login')
    public async login(@Payload(new ValidationPipe()) data: LoginDto) {
        try {
            const result = await this.auth.login(data)
            return { ok: true, data: result }
        }
        
        catch(error) {
            return { ok: false, error }
        }
    }

    @MessagePattern('refresh')
    public async refresh(@Payload(new ValidationPipe()) data: { refreshToken: string }) {
        try {
            const result = await this.auth.refreshToken(data.refreshToken)
            return { ok: true, data: result }
        }
        
        catch(error) {
            return { ok: false, error }
        }
    }
}