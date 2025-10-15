import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto.ts'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service.ts'
import { LoginDto } from './dto/login.dto.ts'

@Controller('auth')
export class AuthController {
    public constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() register: RegisterDto) {
        return this.authService.register(register)
    }

    @Post('login')
    async login(@Body() login: LoginDto) {
        return this.authService.login(login)
    }

    @Post('refresh')
    async refresh(@Body() { refreshToken }: { refreshToken: string }) {
        return this.authService.refreshToken(refreshToken)
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(req: any) {
        return req.user
    }
}