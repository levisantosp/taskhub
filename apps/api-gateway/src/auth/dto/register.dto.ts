import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers and underscores' })
    @ApiProperty({
        description: 'Unique username'
    })
    public username!: string
    
    @IsEmail(undefined, {
        message: 'Please provide an valid email address'
    })
    @ApiProperty({
        example: 'user@domain.com',
        description: 'User email address'
    })    @ApiProperty({})
    public email!: string

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number'
    })
    @ApiProperty({
        description: 'User password'
    })
    public password!: string
}