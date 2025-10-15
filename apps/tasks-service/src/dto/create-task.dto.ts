import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator'

export class CreateTask {
    @IsString()
    public title!: string

    @IsString()
    @IsOptional()
    public description?: string

    @IsDateString()
    public deadline!: Date

    @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    @IsOptional()
    public priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

    @IsArray()
    @IsOptional()
    public assignedUserIds?: string[]
}