import colors from 'colors'
import moment from 'moment'

export const info = (message: unknown) => console.log(colors.green(`[${moment(Date.now()).format('hh:mm:ss A')}] ${message}`))

export const warn = (message: unknown) => console.log(colors.yellow(`[${moment(Date.now()).format('hh:mm:ss A')}] ${message}`))

export const error = (error: Error) => console.log(colors.red(`[${moment(Date.now()).format('hh:mm:ss A')}] ${error.stack ?? error}`))