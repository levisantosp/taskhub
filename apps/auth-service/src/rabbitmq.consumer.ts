import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AuthService } from './auth.service.ts'

@Controller()
export class RabbitMqConsumer {
    public constructor(private readonly auth: AuthService) {}

    @MessagePattern('register')
    public async register(data: any) {
        try {
            const result = await this.auth.register(data)
            return { ok: true, data: result }
        }
        
        catch(error) {
            return { ok: true, error }
        }
    }

    @MessagePattern('login')
    public async login(data: any) {
        try {
            const result = await this.auth.login(data)
            return { ok: true, data: result }
        }
        
        catch(error) {
            return { ok: false, error }
        }
    }

    @MessagePattern('refresh')
    public async refresh(data: any) {
        try {
            const result = await this.auth.refreshToken(data.refreshToken)
            return { ok: true, data: result }
        }
        
        catch(error) {
            return { ok: false, error }
        }
    }
}