"use client"
import React, { useState } from 'react'
import UserMessageCard from './UserMessage'
import BotMessageCard from './BotMessage'
import ChatMetaDataModal from './ChatMetaDataModal'
export default function ChatHistoryContent({ data }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [metaData, setMetaData] = useState(null);
    return (
        <div >
            {data.map((message, index) => (
                <div key={index} className='w-full flex flex-col'>
                    <div className='flex justify-end mb-3'>
                        <UserMessageCard key={index} message={message.user_message} />
                    </div>
                    <div className='flex justify-start mb-3'>
                        <BotMessageCard key={index} message={message} setModalOpen={setModalOpen} setMetaData={setMetaData} />
                    </div>
                </div>
            ))}
            {modalOpen && <ChatMetaDataModal onClose={() => setModalOpen(false)} metaData={metaData} />}
        </div>
    )
}
