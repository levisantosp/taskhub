import { NestFactory } from '@nestjs/core'
import { info } from '@taskhub/utils'
import { AppModule } from './app.module.ts'

const app = await NestFactory.create(AppModule)

const port = process.env.PORT || 3001

app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true
})

await app.listen(port)

info(`api gateway running at ${port}`)