import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    ManyToOne,
    OneToMany
} from 'typeorm'
import { User } from './user.entity.ts'
import { Comment } from './comment.entity.ts'
import { TaskHistory } from './history.entity.ts'

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    public id!: string

    @Column()
    public title!: string

    @Column('text')
    public description!: string

    @Column({ type: 'timestamp' })
    public deadline!: Date

    @Column({
        type: 'enum',
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
    })
    public priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'

    @Column({
        type: 'enum',
        enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
        default: 'TODO'
    })
    public status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' = 'TODO'

    @ManyToMany(() => User, user => user.assignedTasks)
    public assignedUsers!: User[]

    @ManyToOne(() => User, user => user.createdTasks)
    public createdBy!: User

    @OneToMany(() => Comment, comment => comment.task)
    public comments!: Comment[]

    @OneToMany(() => TaskHistory, history => history.task)
    public history!: TaskHistory[]

    @CreateDateColumn()
    public createdAt!: Date

    @UpdateDateColumn()
    public updatedAt!: Date
}