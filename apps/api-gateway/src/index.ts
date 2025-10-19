import { NestFactory } from '@nestjs/core'
import { info } from '@taskhub/utils'
import { AppModule } from './app.module.ts'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const app = await NestFactory.create(AppModule)

const doc = new DocumentBuilder()
    .setTitle('TaskHub API')
    .setDescription('A collaborative task management platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

SwaggerModule.setup('/api/docs', app, SwaggerModule.createDocument(app, doc))

const port = process.env.PORT || 3001

app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
})

await app.listen(port)

info(`api gateway running at ${port}`)
info(`swagger avaialble at http://localhost:${port}/api/docs`)