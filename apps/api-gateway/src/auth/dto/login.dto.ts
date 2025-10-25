import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
    @IsEmail(undefined, {
        message: 'Please provide an valid email address'
    })
    @ApiProperty({
        example: 'user@domain.com',
        description: 'User email address'
    })
    public email!: string

    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    @ApiProperty({
        description: 'User password'
    })
    public password!: string
}