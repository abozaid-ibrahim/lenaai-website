import React from 'react'
import ChatHistoryContent from '../scomponent/ChatHistoryContent'
export default function ChatHistory({ data }) {
    console.log(data);
    return (
        <div className='bg-gray-200 rounded-lg p-2 w-full h-160 overflow-y-auto'>
            <ChatHistoryContent data={data} />
        </div>
    )

}
