import { getChatHistory } from "@/components/services/serviceFetching";
import ChatHistoryContent from "@/components/dashbord/scomponent/ChatHistoryContent";

export default async function ChatPage({ params }) {
  const { id } = await params;

  const data = await getChatHistory(id);

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto bg-gray-200 rounded-lg p-4 h-160 overflow-y-auto">
        <p className="text-center text-gray-500">No chat history available.</p>
      </div>
    );
  }

  return <ChatHistoryContent data={data} />;
}
