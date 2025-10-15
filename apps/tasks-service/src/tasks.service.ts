import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Task } from './entities/task.entity.ts'
import { User } from './entities/user.entity.ts'
import { Comment } from './entities/comment.entity.ts'
import { TaskHistory } from './entities/history.entity.ts'
import { CreateTask } from './dto/create-task.dto.ts'
import { UpdateTask } from './dto/update-task.dto.ts'
import { CreateComment } from './dto/create-comment.dto.ts'

@Injectable()
export class TasksService {
    public constructor(
        @InjectRepository(Task)
        private task: Repository<Task>,
        @InjectRepository(User)
        private user: Repository<User>,
        @InjectRepository(Comment)
        private comment: Repository<Comment>,
        @InjectRepository(TaskHistory)
        private history: Repository<TaskHistory>
    ) {}

    public async create(createTask: CreateTask, id: string) {
        const author = await this.user.findOne({
            where: { id }
        })

        if(!author) {
            throw new NotFoundException('User not found')
        }

        const assignedUsers = createTask.assignedUserIds ?
            await this.user.find({
                where: {
                    id: In(createTask.assignedUserIds)
                }
            }) :
            []

        const task = this.task.create({
            ...createTask,
            createdBy: author,
            assignedUsers
        })

        await this.task.save(task)

        await this.logHistory(task, author, 'CREATED', 'Task created')

        return task
    }

    public async findAll(page = 1, size = 10) {
        const [tasks, total] = await this.task.findAndCount({
            relations: ['createdBy', 'assignedUsers', 'comments'],
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
        const task = await this.task.findOne({
            where: { id },
            relations: [
                'createdBy',
                'assignedUsers',
                'comments',
                'comments.author',
                'history',
                'history.changedBy'
            ]
        })

        if(!task) {
            throw new NotFoundException('Task not found')
        }

        return task
    }

    public async update(id: string, updateTask: UpdateTask, changedBy: string) {
        const task = await this.task.findOne({
            where: { id }
        })

        const author = await this.user.findOneBy({ id })

        if(!task) {
            throw new NotFoundException('Task not found')
        }
        if(!author) {
            throw new NotFoundException('Author not found')
        }

        const old = { ...task }

        Object.assign(task, updateTask)

        if(updateTask.assignedUserIds) {
            task.assignedUsers = await this.user.find({
                where: {
                    id: In(updateTask.assignedUserIds)
                }
            })
        }

        await this.task.save(task)

        await this.logChanges(task, old, author)
        
        return task
    }

    public async delete(id: string) {
        const task = await this.findUnique(id)

        await this.task.remove(task)

        return { message: 'Task deleted successfully' }
    }

    public async createComment(createComment: CreateComment) {
        const task = await this.task.findOneBy({ id: createComment.taskId })

        const author = await this.user.findOneBy({ id: createComment.authorId })

        if(!task) {
            throw new NotFoundException('Task not found')
        }

        if(!author) {
            throw new NotFoundException('Author not found')
        }

        const comment = this.comment.create({
            content: createComment.content,
            task,
            author
        })

        await this.comment.save(comment)

        await this.logHistory(task, author, 'CREATE_COMMENT', `Comment created: ${createComment.content.substring(0, 50)}...`)

        return comment
    }

    public async findComments(task: string, page = 1, size = 10) {
        const [comments, total] = await this.comment.findAndCount({
            where: {
                task: {
                    id: task
                }
            },
            relations: ['author'],
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