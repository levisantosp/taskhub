import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { info } from '@taskhub/utils'
import { NotificationsModule } from './notifications.module.ts'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

const app = await NestFactory.create(NotificationsModule)

// app.useGlobalPipes(
//     new ValidationPipe({
//         whitelist: true,
//         forbidNonWhitelisted: true,
//         transform: true
//     })
// )
//     .enableCors()

app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
        queue: 'task.events.queue',
        queueOptions: { durable: true }
    }
})

await app.startAllMicroservices()

const port = process.env.PORT || 3002

await app.listen(port)

info(`notifications service running at ${port}`)
info('rabbitmq consumer connected succesfully')