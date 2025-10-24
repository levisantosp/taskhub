import type { TaskPriority, TaskStatus } from '@taskhub/types'
import { IsString, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator'

export class CreateTask {
    @IsString()
    public title!: string

    @IsString()
    @IsOptional()
    public description?: string

    @IsDateString()
    public deadline!: string

    @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    public priority!: TaskPriority

    @IsEnum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
    public status!: TaskStatus

    @IsArray()
    @IsOptional()
    public assignedUsers?: string[]
}