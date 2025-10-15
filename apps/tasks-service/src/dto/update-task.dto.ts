import { PartialType } from '@nestjs/mapped-types'
import { CreateTask } from './create-task.dto.ts'
import { IsEnum } from 'class-validator'
import { Column } from 'typeorm'

export class UpdateTask extends PartialType(CreateTask) {
    @IsEnum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'])
    public status!: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'

    @Column('uuid')
    public changedBy!: string
}