export default function BotMessageCard({ message }) {
    return (
        <div className=' w-fit rounded-lg p-2 bg-white flex flex-col'>
            <div className='text-sm'>
                {message}
            </div>
            <div className='text-xs text-gray-500 mt-2'>
                {new Date().toLocaleString()}
            </div>
        </div>
    )
}