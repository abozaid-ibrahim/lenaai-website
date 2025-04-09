import React from "react";
import { getChatHistory } from "@/components/services/serviceFetching";
import ChatHistory from "@/components/dashbord/pages/ChatHistory";
export default async function Page({ params }) {
  const { id } = await params;
  console.log("id", id);

  const data = await getChatHistory(id);
  return <ChatHistory data={data} />;
}
