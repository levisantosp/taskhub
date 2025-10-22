import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module.ts'
import { Logger, ValidationPipe } from '@nestjs/common'
import { Transport, type MicroserviceOptions } from '@nestjs/microservices'

const app = await NestFactory.create(AuthModule)

const console = new Logger('Auth Service')

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
        queue: 'auth.queue',
        queueOptions: { durable: true }
    }
})

const port = process.env.PORT || 3002

await app.startAllMicroservices()
await app.listen(port)

console.log(`🔒 Auth Service running at ${port}`)
console.log(`🐰 RabbitMQ connected succesfully!`)