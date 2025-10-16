import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    public id!: string

    @Column()
    public type!: string

    @Column('text')
    public title!: string

    @Column('text')
    public message!: string

    @Column('jsonb')
    public metadata!: any

    @Column({ default: false })
    public read!: boolean

    @Column('uuid')
    public userId!: string

    @CreateDateColumn()
    public createdAt!: Date
}