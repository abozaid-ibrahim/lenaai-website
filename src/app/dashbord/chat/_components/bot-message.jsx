import PropertyCard from "@/components/ui/property-card";

export default function BotMessageCard({ message }) {
  const { properties, bot_response } = message;
  const propertiesItems = Object.values(properties);

  return (
    <div className=" w-fit rounded-lg p-2 bg-white flex flex-col">
      <div className="text-sm">{bot_response}</div>

      {propertiesItems?.length > 0 &&
        propertiesItems.map((itm) => (
          <PropertyCard key={itm.property_id} data={itm.metadata} />
        ))}
    </div>
  );
}
