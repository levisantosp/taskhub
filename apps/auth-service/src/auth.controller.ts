import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto.ts'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service.ts'
import { LoginDto } from './dto/login.dto.ts'

@Controller('auth')
export class AuthController {
    public constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(registerDto: RegisterDto) {
        return this.authService.register(registerDto)
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post('refresh')
    async refresh(refreshToken: string) {
        return this.authService.refreshToken(refreshToken)
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(req: any) {
        return req.user
    }
}