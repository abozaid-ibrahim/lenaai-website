import React from 'react'
import UserMessageCard from '../scomponent/UserMessage'
import BotMessageCard from '../scomponent/BotMessage'
export default function ChatHistory({ data }) {
    console.log(data);
    return (
        <div className='bg-gray-200 rounded-lg p-2 w-full h-160 overflow-y-auto'>
            <div >
                {data.map((message, index) => (
                    <div key={index} className='w-full flex flex-col'>
                        <div className='flex justify-end mb-3'>
                            <UserMessageCard key={index} message={message.user_message} />
                        </div>
                        <div className='flex justify-start mb-3'>
                            <BotMessageCard key={index} message={message.bot_response} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
