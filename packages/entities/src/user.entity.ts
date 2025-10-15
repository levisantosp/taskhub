import { Entity, ManyToMany, OneToMany } from 'typeorm'
import { BaseUser } from './base-user.entity.ts'
import { Task } from './task.entity.ts'

@Entity('users')
export class User extends BaseUser {
    @ManyToMany(() => Task, task => task.assignedUsersId)
    public assignedTasks!: Task[]

    @OneToMany(() => Task, task => task.createdBy)
    public createdTasks!: Task[]
}