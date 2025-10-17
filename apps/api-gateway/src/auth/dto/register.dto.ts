import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class RegisterDto {
    @IsString()
    @MinLength(3)
    public username!: string
    
    @IsEmail()
    public email!: string

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter and one number'
    })
    public password!: string
}