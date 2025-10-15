import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm'
import { Task } from './task.entity.ts'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id!: string

    @Column({ unique: true })
    public email!: string

    @Column({ unique: true })
    public username!: string

    @ManyToMany(() => Task, task => task.assignedUsers)
    public assignedTasks!: Task[]

    @OneToMany(() => Task, task => task.createdBy)
    public createdTasks!: Task[]
}