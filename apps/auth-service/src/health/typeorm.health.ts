import { Injectable } from '@nestjs/common'
import { HealthIndicator, HealthCheckError } from '@nestjs/terminus'
import { DataSource } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'

@Injectable()
export class TypeOrmHealthIndicator extends HealthIndicator {
    public constructor(
        @InjectDataSource()
        private readonly connection: DataSource
    ) {
        super()
    }

    public async isHealthy(key: string) {
        try {
            await this.connection.query('SELECT 1')
            return this.getStatus(key, true)
        }
        
        catch(e) {
            throw new HealthCheckError('TypeORM health check failed', this.getStatus(key, false, { message: (e as Error).message }))
        }
    }
}