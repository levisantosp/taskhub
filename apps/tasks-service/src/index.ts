import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { TasksModule } from './tasks.module.ts'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

const app = await NestFactory.create(TasksModule)

const console = new Logger('Tasks Service')

app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    })
)
    .enableCors({
        origin: 'http://localhost:3000',
        credentials: true
    })

app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: 'task.queue',
        queueOptions: { durable: true }
    }
})

const port = process.env.PORT || 3003

await app.startAllMicroservices()
await app.listen(port)

console.log(`📕 Tasks Service running at ${port}`)
console.log(`🐰 RabbitMQ connected successfully!`)