import { getChatHistory } from "@/components/services/serviceFetching";
import SendNewMessageForm from "../_components/send-new-message";
import ChatHistory from "../_components/chat-history";

export default async function ChatPage({ params }) {
  const { id } = await params;

  const data = await getChatHistory(id);

  return (
    <div className="relative container mx-auto flex flex-col h-full bg-gray-200 rounded-md pb-14">
      <ChatHistory data={data} />

      <SendNewMessageForm />
    </div>
  );
}
