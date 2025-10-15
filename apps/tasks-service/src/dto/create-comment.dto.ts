import { IsString, IsUUID } from 'class-validator'

export class CreateComment {
    @IsString()
    public content!: string

    @IsUUID()
    public taskId!: string

    @IsUUID()
    public authorId!: string
}