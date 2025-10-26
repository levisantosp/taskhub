import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { HealthController } from './health.controller.ts'
import { TypeOrmHealthIndicator } from './typeorm.health.ts'

@Module({
    imports: [
        TerminusModule,
        HttpModule,
        ClientsModule.register([
            {
                name: 'RMQ_HEALTH_CHECK',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
                    queue: 'health_check_ping_queue',
                    queueOptions: {
                        durable: false,
                        autoDelete: true
                    }
                }
            }
        ])
    ],
    controllers: [HealthController],
    providers: [TypeOrmHealthIndicator]
})
export class HealthModule {}