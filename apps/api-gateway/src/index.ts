import { NestFactory } from '@nestjs/core'
import { info } from '@taskhub/utils'
import { AppModule } from './app.module.ts'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

const app = await NestFactory.create(AppModule)

app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    })
)

const doc = new DocumentBuilder()
    .setTitle('TaskHub API')
    .setDescription('A collaborative task management platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

SwaggerModule.setup('/docs', app, SwaggerModule.createDocument(app, doc))

const port = process.env.PORT || 3001

app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
})

await app.listen(port)

info(`🚀 API Gateway running at http://localhost:${port}`)
info(`📘 Swagger: http://localhost:${port}/docs`)