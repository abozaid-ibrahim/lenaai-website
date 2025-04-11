"use client";

export default function SendNewMessageForm() {
  return (
    <form className="absolute bottom-0 left-0 right-0 bg-white h-14 px-2 flex gap-2 items-center justify-center shadow-xl">
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
        Send
      </button>
    </form>
  );
}
