import { PartialType } from '@nestjs/mapped-types'
import { CreateTask } from './create-task.dto.ts'
import { IsDateString, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'
import type { TaskStatus } from '@taskhub/types'

export class UpdateTask extends PartialType(CreateTask) {
    @IsOptional()
    @IsString()
    @MinLength(1)
    public title?: string

    @IsOptional()
    @IsString()
    public description?: string

    @IsOptional()
    @IsEnum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
    public status?: TaskStatus

    @IsOptional()
    @IsDateString()
    public deadline?: Date

    // @IsUUID()
    // public changedBy!: string
}