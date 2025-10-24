import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import {
    WebSocketGateway, 
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@Controller()
@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000'
    },
    transport: ['websocket']
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    public server!: Server

    public console = new Logger('WebSocket')
    private sockets = new Map<string, Socket[]>()

    public handleConnection(client: Socket) {
        this.console.log(`Client connected: ${client.id}`)
    }

    public handleDisconnect(client: Socket) {
        this.console.log(`Client disconnected: ${client.id}`)

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