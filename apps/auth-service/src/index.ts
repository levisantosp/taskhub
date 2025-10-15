import { NestFactory } from '@nestjs/core'
import { AuthModule } from './auth.module.ts'
import { ValidationPipe } from '@nestjs/common'
import { info } from '@taskhub/utils'
import 'reflect-metadata'

const app = await NestFactory.create(AuthModule)

app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    })
)
    .enableCors()

const port = process.env.PORT || 3002

await app.listen(port)

info(`auth service running at ${port}`)