import { Entity, ManyToMany, OneToMany } from 'typeorm'
import { BaseUser } from './base-user.entity.ts'
import { Task } from './task.entity.ts'
import { Comment } from './comment.entity.ts'

@Entity('users')
export class User extends BaseUser {
    @ManyToMany(() => Task, task => task.assignedUsersId)
    public assignedTasks!: Task[]

    @OneToMany(() => Task, task => task.createdBy)
    public createdTasks!: Task[]

    @OneToMany(() => Comment, comment => comment.author)
    public comments!: Comment[]
}