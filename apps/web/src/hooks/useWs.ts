import { useEffect, useState } from 'react'

type Notification = {
    type: string
    payload: any
    timestamp: Date
}

export default function useWebSocket() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    useEffect(() => {
        const handleMessage = (event: CustomEvent) => {
            const message = event.detail

            const notification: Notification = {
                type: message.type,
                payload: message.payload,
                timestamp: new Date()
            }

            setNotifications(prev => [notification, ...prev])
        }

        window.addEventListener('websocket.message', handleMessage as EventListener)

        return () => window.removeEventListener('websocket.message', handleMessage as EventListener)
    }, [])

    const clearNotifications = () => setNotifications([])

    const removeNotification = (index: number) => setNotifications(prev => prev.filter((_, i) => i !== index))

    return {
        notifications,
        clearNotifications,
        removeNotification
    }
}