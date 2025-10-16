import {
    WebSocketGateway, 
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets'
import { info } from '@taskhub/utils'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    public server!: Server

    private sockets = new Map<string, Socket[]>()

    public handleConnection(client: Socket) {
        info(`client connected: ${client.id}`)
    }

    public handleDisconnect(client: Socket) {
        info(`client disconnected: ${client.id}`)

        for(const [user, sockets] of this.sockets.entries()) {
            const i = sockets.indexOf(client)

            if(i > -1) {
                sockets.splice(i, 1)

                if(!sockets.length) {
                    this.sockets.delete(user)
                }
            }
        }
    }

    public register(user: string, client: Socket) {
        if(!this.sockets.has(user)) {
            this.sockets.set(user, [])
        }

        this.sockets.get(user)?.push(client)
    }

    public sendTo<T extends string>(user: string, event: T, data: unknown) {
        const sockets = this.sockets.get(user)

        if(sockets) {
            sockets.forEach(c => {
                c.emit(event, data)
            })
        }
    }

    public broadcast<T extends string>(event: T, data: unknown) {
        this.server.emit(event, data)
    }

    @SubscribeMessage('register')
    public handleRegister(
        @MessageBody() user: string,
        @ConnectedSocket() client: Socket
    ) {
        this.register(user, client)

        return { ok: true }
    }
}