import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { TasksModule } from './tasks.module.ts'
import { info } from '@taskhub/utils'

const app = await NestFactory.create(TasksModule)

app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    })
)
    .enableCors()

const port = process.env.PORT || 3003

await app.listen(port)

info(`tasks service running at ${port}`)