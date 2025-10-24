import useWebSocket from '../hooks/useWs.ts'
import { Button } from './ui/button.tsx'

export default function Notifications() {
    const ws = useWebSocket()

    const notifications = ws.notifications.filter(n =>
        n.payload.type !== 'task.comment.created'
    )

    if(!notifications.length) {
        return null
    }

    return (
        <>
            <div
                className='fixed top-4 right-4 z-50 space-y-2 max-w-sm'
            >
                {notifications.map((notification, index) => (
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
                                size='sm'
                                onClick={() => ws.removeNotification(index)}
                                className='h-6 w-6 p-0'
                            >
                                ×
                            </Button>
                        </div>

                        <h5
                            className='text-base font-bold text-gray-600'
                        >
                            {notification.payload.title}
                        </h5>

                        <p>
                            {notification.payload.message}
                        </p>

                        <span
                            className='text-xs text-gray-400 mt-2'
                        >
                            {notification.timestamp.toLocaleTimeString()}
                        </span>
                    </div>
                ))}

                {notifications.length > 1 && (
                    <Button
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