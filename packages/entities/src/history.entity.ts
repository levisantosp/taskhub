import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { Task } from './task.entity.ts'
import { User } from './user.entity.ts'

@Entity('task_history')
export class TaskHistory {
    @PrimaryGeneratedColumn('uuid')
    public id!: string

    @Column('text')
    public field!: string

    @Column('text')
    public oldValue!: string

    @Column('text')
    public newValue!: string

    @ManyToOne(() => Task, task => task.history)
    public task!: any

    @ManyToOne(() => User)
    public changedBy!: any

    @CreateDateColumn()
    public changedAt!: Date
}