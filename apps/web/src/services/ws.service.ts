export default class WebSocketService {
    private socket: WebSocket | null = null
    private reconnectAttempts = 0
    private maxReconnectAttemps = 5
    
    public connect(token: string) {
        try {
            this.socket = new WebSocket(`ws://localhost:3001/ws?token=${token}`)
            
            this.socket.onopen = () => {
                console.log('websocket connected')
                
                this.reconnectAttempts = 0
            }
            
            this.socket.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data))
            }
            
            this.socket.onclose = () => {
                console.warn('websocket disconnected')
                
                this.reconnect(token)
            }
            
            this.socket.onerror = (error) => {
                console.error(error)
            }
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
        if(this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message))
        }
    }
}

export const ws = new WebSocketService()