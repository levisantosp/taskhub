import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator'

export class CreateComment {
    @ApiProperty({
        description: 'Comment content',
        example: 'This needs to be reviewed'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    public content!: string

    @ApiProperty({
        description: 'Author ID'
    })
    @IsNotEmpty()
    @IsUUID()
    public authorId!: string
}