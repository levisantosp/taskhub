import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { CreateTask } from './dto/create-task.dto.ts'
import { UpdateTask } from './dto/update-task.dto.ts'
import { CreateComment } from './dto/create-comment.dto.ts'
import { Task, User, Comment, TaskHistory } from '@taskhub/entities'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class TasksService implements OnModuleInit {
    public constructor(
        @InjectRepository(Task)
        private task: Repository<Task>,

        @InjectRepository(User)
        private user: Repository<User>,

        @InjectRepository(Comment)
        private comment: Repository<Comment>,

        @InjectRepository(TaskHistory)
        private history: Repository<TaskHistory>,

        @Inject('notifications.queue')
        private notifications: ClientProxy
    ) {}

    public async onModuleInit() {
        await this.notifications.connect()
    }

    public async create(createTask: CreateTask, id: string) {
        const author = await this.user.findOne({
            where: { id }
        })

        if(!author) {
            throw new NotFoundException('User not found')
        }

        const task = this.task.create(createTask)

        await this.task.save(task)

        this.notifications.emit('task.created', {
            id: task.id,
            title: task.title,
            description: task.description,
            createdBy: task.createdBy,
            assignedUsers: task.assignedUsersId,
            createdAt: task.createdAt
        })

        await this.logHistory(task, author, 'CREATED', 'Task created')

        return task
    }

    public async findAll(page = 1, size = 10) {
        const [tasks, total] = await this.task.findAndCount({
            skip: (page - 1) * size,
            take: size,
            order: {
                createdAt: 'DESC'
            }
        })

        return {
            tasks,
            pagination: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size)
            }
        }
    }

    async findUnique(id: string) {
        const task = await this.task.findOne({ where: { id } })

        if(!task) {
            throw new NotFoundException('Task not found')
        }

        return task
    }

    public async update(id: string, updateTask: UpdateTask, changedBy: string) {
        const task = await this.task.findOne({
            where: { id }
        })

        const author = await this.user.findOneBy({ id: changedBy })

        if(!task) {
            throw new NotFoundException('Task not found')
        }

        if(!author) {
            throw new NotFoundException('Author not found')
        }

        const old = { ...task }

        Object.assign(task, updateTask)

        if(updateTask.assignedUserIds) {
            task.assignedUsersId = updateTask.assignedUserIds
        }

        await this.task.save(task)

        this.notifications.emit('task.updated', {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            updatedAt: task.updatedAt,
            changedBy: changedBy
        })

        await this.logChanges(task, old, author)
        
        return task
    }

    public async delete(id: string) {
        const task = await this.findUnique(id)

        await this.history.delete({ task: { id } })
        await this.task.remove(task)

        return { message: 'Task deleted successfully' }
    }

    public async createComment(taskId: string, createComment: CreateComment) {
        const task = await this.task.findOneBy({ id: taskId })

        const author = await this.user.findOneBy({ id: createComment.authorId })

        if(!task) {
            throw new NotFoundException('Task not found')
        }

        if(!author) {
            throw new NotFoundException('Author not found')
        }

        const comment = this.comment.create({
            content: createComment.content,
            task: task.id,
            author: author
        })

        await this.comment.save(comment)

        this.notifications.emit('task.comment.created', {
            author: comment.author,
            content: comment.content,
            createdAt: comment.createdAt,
            id: comment.id,
            taskId: comment.task
        })

        await this.logHistory(task, author, 'CREATE_COMMENT', `Comment created: ${createComment.content.substring(0, 50)}...`)

        return comment
    }

    public async findComments(task: string, page = 1, size = 10) {
        const [comments, total] = await this.comment.findAndCount({
            where: {
                task
            },
            order: {
                createdAt: 'DESC'
            },
            skip: (page - 1) * size,
            take: size
        })

        return {
            comments,
            pagination: {
                page,
                size,
                total,
                totalPages: Math.ceil(total / size)
            }
        }
    }

    private async logChanges(task: Task, oldValues: any, changedBy: User) {
        const fields = ['title', 'description', 'priority', 'status'] as const

        for(const field of fields) {
            if(oldValues[field] !== task[field]) {
                const history = this.history.create({
                    field,
                    oldValue: String(oldValues[field]),
                    newValue: String(task[field]),
                    task,
                    changedBy
                })

                await this.history.save(history)
            }
        }
    }

    private async logHistory(task: Task, user: User, action: string, description: string) {
        const history = this.history.create({
            field: 'SYSTEM',
            oldValue: action,
            newValue: description,
            task,
            changedBy: user
        })

        await this.history.save(history)
    }
}