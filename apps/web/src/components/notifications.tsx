import { useEffect } from 'react'
import useWebSocket from '../hooks/useWs.ts'
import { Button } from './ui/button.tsx'

export default function Notifications() {
    const ws = useWebSocket()

    const token = localStorage.getItem('accessToken')

    useEffect(() => {
        if(token) {
            console.log('connecting to websocket')

            ws.connect(token)
        }
    }, [token, ws.connect])

    if(!ws.notifications.length) {
        return null
    }

    return (
        <>
            <div
                className='fixed top-4 right-4 z-50 space-y-2 max-w-sm'
            >
                {ws.notifications.map((notification, index) => (
                    <div
                        key={index}
                        className='bg-white border rounded-lg shadow-lg p-4 animate-in slide-in-from-right'
                    >
                        <div
                            className='flex justify-between items-start mb-2'
                        >
                            <h4
                                className='font-semibold capitalize'
                            >
                                {notification.type.replace('.', ' ')}
                            </h4>

                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => ws.removeNotification(index)}
                                className='h-6 w-6 p-0'
                            >
                                ×
                            </Button>
                        </div>

                        <p
                            className='text-sm text-gray-600'
                        >
                            {JSON.stringify(notification.payload, null, 2)}
                        </p>

                        <p
                            className='text-xs text-gray-400 mt-2'
                        >
                            {notification.timestamp.toLocaleTimeString()}
                        </p>
                    </div>
                ))}

                {ws.notifications.length > 1 && (
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={ws.clearNotifications}
                        className='w-full'
                    >
                        Clear All
                    </Button>
                )}
            </div>
        </>
    )
}