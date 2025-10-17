import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthClient } from './auth-client.ts'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    public constructor(private readonly auth: AuthClient) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret'
        })
    }

    public async validate(payload: any) {
        console.log('validating user:', payload)

        return {
            userId: payload.sub,
            email: payload.email,
            username: payload.username
        }
    }
}