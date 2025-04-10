"use client";

import { useState } from "react";
import UserMessageCard from "./user-message";
import BotMessageCard from "./bot-message";
import ChatMetaDataModal from "./meta-data-dialog";

export default function ChatHistory({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [metaData, setMetaData] = useState(null);

  return (
    <div className=" rounded-lg px-4 pt-4 overflow-y-auto">
      {data.map((message, index) => (
        <div key={index} className="w-full flex flex-col">
          <div className="flex justify-end mb-3">
            <UserMessageCard key={index} message={message.user_message} />
          </div>
          <div className="flex justify-start mb-3">
            <BotMessageCard
              key={index}
              message={message}
              setModalOpen={setModalOpen}
              setMetaData={setMetaData}
            />
          </div>
        </div>
      ))}

      {/* TODO: Modal should NOT renders here. This in NOT a performant approach */}
      {modalOpen && (
        <ChatMetaDataModal
          onClose={() => setModalOpen(false)}
          metaData={metaData}
        />
      )}
    </div>
  );
}
