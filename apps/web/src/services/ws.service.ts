import { io, Socket } from 'socket.io-client'

export default class WebSocketService {
    private socket: Socket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttemps = 5
    
    public connect(token: string) {
        try {
            this.socket = io('ws://localhost:3001/ws', {
                transports: ['websocket'],
                auth: { token }
            })

            this.socket.on('connect', () => {
                console.log('websocket connected')

                this.reconnectAttempts = 0
            })
            
            this.socket.on('connected', data => {
                console.log('connected:', data)
            })
            
            this.socket.onAny((event, ...args) => {
                console.log('evento qualquer', event, args)
            })

            this.socket.on('task.created', data => {
                console.log('task criada com sucesso', data)

                this.handleMessage({
                    type: 'task.created',
                    payload: data
                })
            })

            this.socket.on('task.updated', data => {
                this.handleMessage({
                    type: 'task.updated',
                    payload: data
                })
            })
            
            this.socket.on('disconnect', reason => {
                console.warn('socket disconnected:', reason)

                this.reconnect(token)
            })
            
            this.socket.on('error', error => {
                console.error('socket error:', error)
            })
        }
        
        catch(e) {
            throw new Error((e as Error).message)
        }
    }
    
    private handleMessage(data: unknown) {
        const event = new CustomEvent('websocket.message', { detail: data })
        
        window.dispatchEvent(event) 
    }
    
    private reconnect(token: string) {
        if(this.reconnectAttempts < this.maxReconnectAttemps) {
            this.reconnectAttempts++
            
            console.warn(`attemptting reconnect (${this.reconnectAttempts}/${this.maxReconnectAttemps})`)
            
            setTimeout(() => {
                this.connect(token)
            }, 5000 * this.reconnectAttempts)
        }
    }
    
    public disconnect() {
        if(this.socket) {
            this.socket.close()
            this.socket = null
        }
    }
    
    public send(message: unknown) {
        if(this.socket) {
            this.socket.send(JSON.stringify(message))
        }
    }
}

export const ws = new WebSocketService()