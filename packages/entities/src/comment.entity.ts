import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { Task } from './task.entity.ts'
import { User } from './user.entity.ts'

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    public id!: string

    @Column('text')
    public content!: string

    @Column('uuid')
    public task!: string

    @Column('uuid')
    public author!: string

    @CreateDateColumn()
    public createdAt!: Date
}