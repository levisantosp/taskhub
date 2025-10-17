import { Body, Controller, HttpException, HttpStatus, Logger, Post } from '@nestjs/common'
import { AuthClient } from './auth-client.ts'
import { firstValueFrom } from 'rxjs'

@Controller('auth')
export class AuthController {
    public constructor(private readonly client: AuthClient) {}

    @Post('register')
    public async register(@Body() data: unknown) {
        try {
            await firstValueFrom(this.client.send('register', data))
        }

        catch(e) {
            throw new HttpException((e as Error).message, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('login')
    public async login(@Body() data: unknown) {
        try {
            return await firstValueFrom(this.client.send('login', data))
        }

        catch(e) {
            throw new HttpException((e as Error).message, HttpStatus.UNAUTHORIZED)
        }
    }

    @Post('refresh')
    public async refresh(@Body() data: unknown) {
        try {
            return await firstValueFrom(this.client.send('refresh', data))
        }

        catch(e) {
            throw new HttpException((e as Error).message, HttpStatus.UNAUTHORIZED)
        }
    }
}