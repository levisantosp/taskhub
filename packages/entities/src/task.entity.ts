import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm'

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

    @Column('simple-array')
    public assignedUsersId!: string[]

    @Column('uuid')
    public createdBy!: string

    @OneToMany('Comment', 'task')
    public comments!: any[]

    @OneToMany('TaskHistory', 'task', { cascade: true })
    public history!: any[]

    @CreateDateColumn()
    public createdAt!: Date

    @UpdateDateColumn()
    public updatedAt!: Date
}