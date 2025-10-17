import { Injectable } from '@nestjs/common'
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'

@Injectable()
export class AuthClient {
    private client: ClientProxy

    public constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
                queue: 'auth.queue',
                queueOptions: { durable: true }
            }
        })
    }

    public send<T extends string>(pattern: T, data: unknown) {
        return this.client.send(pattern, data)
    }
}