import { Injectable, Logger } from '@nestjs/common'
import type { RabbitMQEvent } from '@taskhub/types'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class RabbitMqService {
    private client: ClientProxy
    private logger = new Logger('Tasks Service')

    public constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
                queue: 'task.events.queue',
                queueOptions: { durable: true }
            }
        })
    }

    public async onModuleInit() {
        await this.client.connect()

        this.logger.log('RabbitMQ connected successfully!')
    }

    public async publishEvent(event: RabbitMQEvent) {
        await firstValueFrom(this.client.emit(event, event))
    }
}