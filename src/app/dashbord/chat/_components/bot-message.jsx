export default function BotMessageCard({ message, setModalOpen, setMetaData }) {
  return (
    <div className=" w-fit rounded-lg p-2 bg-white flex flex-col">
      <div className="text-sm">{message.bot_response}</div>
      <div className="text-xs text-gray-500 mt-2">
        {new Date().toLocaleString()}
      </div>
      {message.properties && (
        <button
          onClick={() => {
            setMetaData(message.properties);
            setModalOpen(true);
          }}
          className="w-50 mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          Show Properties
        </button>
      )}
    </div>
  );
}
