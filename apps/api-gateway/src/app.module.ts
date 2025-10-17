import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module.ts'

@Module({
    imports: [AuthModule]
})
export class AppModule {}