import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto.ts'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service.ts'
import { LoginDto } from './dto/login.dto.ts'

@Controller('auth')
export class AuthController {
    public constructor(private readonly authService: AuthService) {}

    @Post('register')
    public async register(@Body() register: RegisterDto) {
        return await this.authService.register(register)
    }

    @Post('login')
    public async login(@Body() login: LoginDto) {
        return await this.authService.login(login)
    }

    @Post('refresh')
    public async refresh(@Body() { refreshToken }: { refreshToken: string }) {
        return await this.authService.refreshToken(refreshToken)
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    public getProfile(req: any) {
        return req.user
    }
}