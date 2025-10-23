import { io, Socket } from 'socket.io-client'

export default class WebSocketService {
    private socket: Socket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttemps = 5
    
    public connect(token: string) {
        try {
            this.socket = io('http://localhost:3004', {
                auth: {
                    token: 'Bearer ' + token
                }
            })

            this.socket.on('connect', () => {
                this.reconnectAttempts = 0
            })
            a
            // this.socket.on('connected', data => {
            //     console.log('connected:', data)
            // })

            this.socket.on('task.created', data => {
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
            
            this.socket.on('disconnect', () => {
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