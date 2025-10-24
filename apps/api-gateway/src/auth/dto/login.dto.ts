import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
    @IsEmail(undefined, {
        message: 'Please provide an valid email address'
    })
    public email!: string

    @IsString()
    @IsNotEmpty({ message: 'Password should not be empty' })
    public password!: string
}