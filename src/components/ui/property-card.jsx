"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Home,
  Square,
  Bath,
  Bed,
  Eye,
  Landmark,
  DollarSign,
  MapPin,
  Share2Icon,
} from "lucide-react";

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-1">
    <div className="bg-blue-100 p-1.5 rounded-md text-blue-600">{icon}</div>
    <div>
      <p className="text-[10px] font-normal text-gray-500 line-clamp-1 ">
        {label}
      </p>
      <p className="text-xs font-medium line-clamp-1 text-gray-800">{value}</p>
    </div>
  </div>
);

export default function PropertyCard({ data }) {
  const [hoveredImage, setHoveredImage] = useState(null);

  const handleImageHover = () => {
    if (data.images?.length > 1) {
      setHoveredImage(data.images[1].url);
    }
  };

  const {
    buildingType,
    floor,
    roomsCount,
    bathroomCount,
    city,
    unitId,
    landArea,
    view,
    finishing,
    totalPrice,
    compound,
    clientName,
  } = data;
  return (
    <div className="flex flex-col gap-2 rounded-md overflow-hidden bg-gray-200 shadow-md p-2 m-2 w-62 h-96">
      <Link
        href={`/dashbord/units/${unitId}`}
        className="rounded-md bg-gray-100 h-44 overflow-hidden relative"
      >
        {data.images?.length > 0 ? (
          <Image
            onMouseEnter={handleImageHover}
            onMouseLeave={() => setHoveredImage(null)}
            src={hoveredImage || data.images[0].url}
            layout="fill"
            objectFit="cover"
            alt="property_iamge"
          />
        ) : (
          <Image
            src="/images/property_placeholder.jpg"
            layout="fill"
            objectFit="cover"
            alt="property_iamge"
          />
        )}
      </Link>

      <div>
        <Link
          href={`/dashbord/units/${unitId}`}
          className="mb-2 line-clamp-1 text-sm font-medium text-gray-800 hover:text-primary hover:underline"
        >
          {clientName} | {buildingType}{" "}
        </Link>

        {/* Property details */}
        <div className="grid grid-cols-2 gap-1.5">
          <InfoItem icon={<Home size={18} />} label="Floor" value={floor} />
          <InfoItem icon={<Bed size={18} />} label="Rooms" value={roomsCount} />
          <InfoItem
            icon={<Bath size={18} />}
            label="Bathrooms"
            value={bathroomCount}
          />
          <InfoItem
            icon={<MapPin size={18} />}
            label="Location"
            value={`${compound}, ${city}`}
          />
          <InfoItem
            icon={<Square size={18} />}
            label="Land Area"
            value={`${landArea} m²`}
          />

          <InfoItem icon={<Eye size={18} />} label="View" value={view} />

          <InfoItem
            icon={<Landmark size={18} />}
            label="Finishing"
            value={finishing}
          />
          <InfoItem
            icon={<DollarSign size={18} />}
            label="Price"
            value={`${totalPrice} EGP`}
          />
        </div>

        {/* Actions */}
        {/* <div className="flex items-center mt-2 gap-1">
          <Link
            href={`/dashbord/units/${unitId}`}
            role="button"
            className="flex-1"
          >
            <div className="w-full px-2 h-8 bg-primary text-white/90 rounded-md font-medium transition hover:opacity-95 duration-300 flex items-center gap-2 justify-center text-sm">
              <Eye size={22} />
              <span>View Details</span>
            </div>
          </Link>

          <button className="flex items-center cursor-pointer justify-center h-8 w-10 py-1.5 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-300">
            <Share2Icon size={22} />
          </button>
        </div> */}
      </div>
    </div>
  );
}
