import { Controller, Get } from '@nestjs/common'
import {
    HealthCheckService,
    TypeOrmHealthIndicator,
    HealthCheck,
    MicroserviceHealthIndicator
} from '@nestjs/terminus'
import { Transport } from '@nestjs/microservices'

@Controller('health')
export class HealthController {
    public constructor(
        private readonly health: HealthCheckService,
        private readonly db: TypeOrmHealthIndicator,
        private readonly microservice: MicroserviceHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    public check() {
        return this.health.check([
            () => this.db.pingCheck('database', { timeout: 300 }),
            () => this.microservice.pingCheck('rabbitmq', {
                transport: Transport.RMQ,
                options: {
                     urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672']
                },
                timeout: 3000
            })
        ])
    }
}