import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { NotificationsModule } from './notifications.module.ts'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { IoAdapter } from '@nestjs/platform-socket.io'

const console = new Logger('Notifications Service')

const app = await NestFactory.create(NotificationsModule)

app.useWebSocketAdapter(new IoAdapter(app))
app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
})
app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: 'notifications.queue',
        queueOptions: { durable: true }
    }
})

await app.startAllMicroservices()

const port = process.env.PORT || 3004

await app.listen(port)

console.log(`🔔 Notifications Service running at ${port}`)
console.log('🐰 RabbitMQ connected successfully!')