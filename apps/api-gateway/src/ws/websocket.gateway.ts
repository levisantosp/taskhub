import { Logger } from '@nestjs/common'
import {
    WebSocketGateway, 
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    },
    namespace: '/ws'
})
export class ApiWebSocketGateWay implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    public server!: Server

    private sockets = new Map<string, Socket[]>()
    private logger = new Logger('WebSocket Gateway')

    public afterInit() {
        this.logger.log('websocket gateway initialized on api gateway')
    }

    public handleConnection(client: Socket) {
        this.logger.log(`client connected: ${client.id}`)

        console.log(client.handshake.query)

        client.emit('connected', { message: 'connected to api gateway' })
    }

    public handleDisconnect(client: Socket) {
        this.logger.log(`client disconnected: ${client.id}`)

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

    public broadcast<T extends string>(event: T, data: unknown) {
        this.server.emit(event, data)
    }
}