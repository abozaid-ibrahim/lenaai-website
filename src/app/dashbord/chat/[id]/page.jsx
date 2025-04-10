import { getChatHistory } from "@/components/services/serviceFetching";
import ChatHistoryContent from "@/components/dashbord/scomponent/ChatHistoryContent";

export default async function ChatPage({ params }) {
  const { id } = await params;

  const data = await getChatHistory(id);
  return (
    <div className="container mx-auto bg-gray-200 rounded-lg p-4 h-160 overflow-y-auto">
      <ChatHistoryContent data={data} />
    </div>
  );
}
