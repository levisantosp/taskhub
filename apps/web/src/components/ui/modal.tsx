import { Button } from './button.tsx'

type Props = {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function Modal(props: Props) {
    if(!props.isOpen) return null

    return (
        <>
            <div
                className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
            >
                <div
                    className='bg-white rounded-lg p-6 w-full max-w-md'
                >
                    <div
                        className='flex justify-between items-center mb-4'
                    >
                        <h2
                            className='text-xl font-bold'
                        >
                            {props.title}

                        </h2>
                        <Button
                            variant='ghost'
                            onClick={props.onClose}
                            className='h-8 w-8 p-0'
                        >
                            ×
                        </Button>
                    </div>
                    {props.children}
                </div>
            </div>
        </>
    )
}