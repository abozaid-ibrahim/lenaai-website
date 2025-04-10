import PropertyCard from "@/components/ui/property-card";

export default function BotMessageCard({ message, setModalOpen, setMetaData }) {
  const { properties, bot_response } = message;
  const propertiesItems = Object.values(properties);

  return (
    <div className=" w-fit rounded-lg p-2 bg-white flex flex-col">
      <div className="text-sm">{bot_response}</div>

      {/* <div className="text-xs text-gray-500 mt-2">
        {new Date().toLocaleString()}
      </div> */}

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

      {propertiesItems?.length > 0 &&
        propertiesItems.map((itm) => (
          <PropertyCard key={itm.property_id} data={itm.metadata} />
        ))}
    </div>
  );
}
