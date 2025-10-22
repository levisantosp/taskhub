import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.ts'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'

const app = await NestFactory.create(AppModule)

const console = new Logger('API Gateway')

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

console.log(`🚀 API Gateway running at http://localhost:${port}`)
console.log(`📘 Swagger: http://localhost:${port}/docs`)