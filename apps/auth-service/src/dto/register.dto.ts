import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class RegisterDto {
    @IsEmail()
    public email!: string

    @IsString()
    @MinLength(3)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers and underscores' })
    public username!: string

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number'
    })    
    public password!: string
}