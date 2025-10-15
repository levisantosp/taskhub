import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth.service.ts'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    public constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey'
        })
    }

    public async validate(payload: string | Buffer | object) {
        return this.authService.validateUser(payload)
    }
}