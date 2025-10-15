import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class RegisterDto {
    @IsEmail()
    public email!: string

    @IsString()
    @MinLength(3)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username can only contain letters, numbers and underscores' })
    public username!: string

    @IsString()
    @MinLength(6)
    public password!: string
}