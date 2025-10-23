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

    @ManyToOne(() => User, (user) => user.comments, { eager: true })
    public author!: User

    @CreateDateColumn()
    public createdAt!: Date
}