import { Comment, Task, TaskHistory, User } from '@taskhub/entities'
import { DataSource, type DataSourceOptions } from 'typeorm'
import url from 'node:url'
import path from 'node:path'

import 'dotenv/config'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'localhost',
    entities: [Task, User, Comment, TaskHistory],
    synchronize: false,
    logging: true,
    migrations: [__dirname + '/migrations/*{.ts,.js}']
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource