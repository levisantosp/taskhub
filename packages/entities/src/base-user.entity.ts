import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Exclude } from 'class-transformer'

export class BaseUser {
    @PrimaryGeneratedColumn('uuid')
    public id!: string

    @Column({ unique: true })
    public email!: string

    @Column({ unique: true })
    public username!: string

    @Column()
    @Exclude()
    public password!: string

    @CreateDateColumn()
    public createdAt!: Date

    @UpdateDateColumn()
    public updatedAt!: Date
}