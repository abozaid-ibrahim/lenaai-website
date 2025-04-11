import UserMessageCard from "./user-message";
import BotMessageCard from "./bot-message";

export default function ChatHistory({ data }) {
  return (
    <div className=" rounded-lg px-4 pt-4 overflow-y-auto">
      {data.map((message, index) => (
        <div key={index} className="w-full flex flex-col">
          <div className="flex justify-end mb-3">
            <UserMessageCard key={index} message={message.user_message} />
          </div>

          <div className="flex justify-start mb-3">
            <BotMessageCard key={index} message={message} />
          </div>
        </div>
      ))}
    </div>
  );
}
