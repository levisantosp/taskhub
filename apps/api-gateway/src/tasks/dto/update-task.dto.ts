import { PartialType } from '@nestjs/mapped-types'
import { CreateTask } from './create-task.dto.ts'
import { IsEnum, IsUUID } from 'class-validator'

export class UpdateTask extends PartialType(CreateTask) {
    @IsEnum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
    public status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'

    @IsUUID()
    public changedBy!: string
}