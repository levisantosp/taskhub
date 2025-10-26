import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RegisterDto } from './dto/register.dto.ts'
import { LoginDto } from './dto/login.dto.ts'
import AuthUtils from '@taskhub/utils/dist/auth.js'
import { BaseUser, User } from '@taskhub/entities'
import { error } from '@taskhub/utils'

@Injectable()
export class AuthService {
    public constructor(
        @InjectRepository(User)
        private user: Repository<User>,
        private jwtService: JwtService
    ) {}

    public async register(register: RegisterDto) {
        const existingUser = await this.user.findOne({
            where: {
                email: register.email,
                username: register.username
            }
        })

        if(existingUser) {
            throw new ConflictException('A user with this email already exists')
        }

        const hashedPass = await AuthUtils.hashPassword(register.password)

        const user = this.user.create({
            email: register.email,
            username: register.username,
            password: hashedPass
        })

        await this.user.save(user)

        const tokens = this.generateTokens(user)

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt
            },
            ...tokens
        }
    }

    public async login(login: LoginDto) {
        const user = await this.user.findOne({
            where: {
                email: login.email
            }
        })

        if(!user || !(await AuthUtils.comparePassword(login.password, user.password))) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const tokens = this.generateTokens(user)

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
            },
            ...tokens,
        }
    }

    public async refreshToken(token: string) {
        try {
            const payload = AuthUtils.verifyToken(token, process.env.JWT_REFRESH_SECRET || 'refreshSecret', )

            const user = await this.user.findOne({
                where: {
                    id: payload.sub as string
                }
            })

            if(!user) {
                throw new UnauthorizedException('User not found')
            }

            return this.generateTokens(user)
        }

        catch(e) {
            error(e as Error)

            throw new UnauthorizedException('Invalid refresh token')
        }
    }

    private generateTokens(user: BaseUser) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username
        }

        const accessToken = this.jwtService.sign(payload)

        const refreshToken = AuthUtils.generateToken(payload, process.env.JWT_REFRESH_SECRET || 'refreshSecret', '7d')

        return { accessToken, refreshToken }
    }

    public async validateUser(payload: any) {
        return await this.user.findOne({
            where: {
                id: payload.id
            }
        })
    }

    public async validdateUserByEmailAndPassword(email: string, password: string) {
        const user = await this.user.findOne({ where: { email } })

        if(user && await AuthUtils.comparePassword(password, user.password)) {
            const { password, ...data } = user

            return data
        }

        return null
    }
}