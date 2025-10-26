import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'
import { AuthClient } from './auth-client.ts'
import { firstValueFrom } from 'rxjs'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RegisterDto } from './dto/register.dto.ts'
import { LoginDto } from './dto/login.dto.ts'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    public constructor(private readonly client: AuthClient) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registration attempt response' })
    @ApiResponse({ status: 400, description: 'Bad Request (Likely validation error from microservice)' })
    public async register(@Body() data: RegisterDto) {
        try {
            return await firstValueFrom(this.client.send('register', data))
        }

        catch(e) {
            throw new HttpException((e as Error).message, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'Log in a user' })
    @ApiResponse({ status: 200, description: 'User login attempt response' })
    @ApiResponse({ status: 401, description: 'Unauthorized (Invalid credentials or other login failure)' })
    public async login(@Body() data: LoginDto) {
        try {
            return await firstValueFrom(this.client.send('login', data))
        }

        catch(e) {
            throw new HttpException((e as Error).message, HttpStatus.UNAUTHORIZED)
        }
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refresh attempt response' })
    @ApiResponse({ status: 401, description: 'Unauthorized (Invalid or expired refresh token)' })
    public async refresh(@Body() data: { refreshToken: string }) {
        try {
            return await firstValueFrom(this.client.send('refresh', data))
        }

        catch(e) {
            throw new HttpException((e as Error).message, HttpStatus.UNAUTHORIZED)
        }
    }
}