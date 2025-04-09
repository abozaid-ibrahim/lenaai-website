"use client";
import React, { useState } from "react";
import im from "../../../../public/images/building1.jpg";
import {
  Eye,
  Edit,
  Trash2,
  MapPin,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddUnitModal from "../scomponent/AddUnitModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
// Sample data - replace with your actual data
const realEstateData = [
  {
    id: 1,
    name: "Sunset Heights",
    image: im,
    description: "Luxury apartments with stunning views",
    location: "Downtown",
    price: "$1,200,000",
    developer: "Skyline Developers",
    buildings: [
      { id: 101, name: "Tower A", units: 45, image: im },
      { id: 102, name: "Tower B", units: 52, image: im },
      { id: 103, name: "Garden Villa", units: 10, image: im },
    ],
  },
  {
    id: 2,
    name: "Pine Creek Estates",
    image: im,
    description: "Modern townhouses in a peaceful neighborhood",
    location: "Suburban Area",
    price: "$850,000",
    developer: "Green Valley Construction",
    buildings: [
      {
        id: 201,
        name: "Block 1",
        units: 24,
        image: "/api/placeholder/400/300",
      },
      {
        id: 202,
        name: "Block 2",
        units: 24,
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    id: 3,
    name: "Marina Bay Residences",
    image: im,
    description: "Waterfront properties with premium amenities",
    location: "Marina District",
    price: "$2,500,000",
    developer: "Skyline Developers",
    buildings: [
      {
        id: 301,
        name: "North Tower",
        units: 60,
        image: "/api/placeholder/400/300",
      },
      {
        id: 302,
        name: "South Tower",
        units: 60,
        image: "/api/placeholder/400/300",
      },
      {
        id: 303,
        name: "Penthouse Block",
        units: 15,
        image: "/api/placeholder/400/300",
      },
    ],
  },
  {
    id: 4,
    name: "Urban Lofts",
    image: im,
    description: "Industrial-style lofts in the arts district",
    location: "Arts District",
    price: "$750,000",
    developer: "Metropolitan Builders",
    buildings: [
      {
        id: 401,
        name: "The Gallery",
        units: 35,
        image: "/api/placeholder/400/300",
      },
      {
        id: 402,
        name: "The Studio",
        units: 28,
        image: "/api/placeholder/400/300",
      },
    ],
  },
];

const RealEstateListings = ({ initialData, comboundata, developersData }) => {
  const navigate = useRouter();
  const [selectedEstate, setSelectedEstate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [developerFilter, setDeveloperFilter] = useState("all"); // Changed from priceFilter
  const [compoundFilter, setCompoundFilter] = useState("all"); // إضافة فلتر للمجمعات
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 8;

  // Filter estates based on search, developer filter, and compound filter
  const filteredEstates = initialData
    ? initialData.filter((estate) => {
        const matchesSearch =
          (estate.name?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (estate.compound?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (estate.city?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        let matchesDeveloper = true;
        if (developerFilter !== "all") {
          matchesDeveloper = estate.developer === developerFilter;
        }

        let matchesCompound = true;
        if (compoundFilter !== "all") {
          matchesCompound = estate.compound === compoundFilter;
        }

        return matchesSearch && matchesDeveloper && matchesCompound;
      })
    : [];

  // Get unique developers for filter dropdown
  const developers = [
    ...new Set(
      developersData
        ? developersData.map((developer) => developer.name)
        : initialData
            .filter((estate) => estate.developer)
            .map((estate) => estate.developer)
    ),
  ];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEstates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEstates.length / itemsPerPage);

  const handleCardClick = (estateId) => {
    setSelectedEstate(selectedEstate === estateId ? null : estateId);
  };

  const handleAddBuilding = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveUnit = (formData) => {
    console.log("New unit data:", formData);
    // Here you would typically add the new unit to your data
    // and possibly make an API call to save it
  };

  const handleUpdateEstate = (id, e) => {
    e.stopPropagation(); // Prevent card expansion
    alert(`Update property with ID: ${id}`);
  };

  const handleDeleteEstate = (id, e) => {
    e.stopPropagation(); // Prevent card expansion
    alert(`Delete property with ID: ${id}`);
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Real Estate Properties
          </h1>
          <p className="text-gray-600 mt-2">Explore our exclusive listings</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="w-full px-5 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <select
                className="flex-1 min-w-[180px] px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={developerFilter}
                onChange={(e) => setDeveloperFilter(e.target.value)}
              >
                <option value="all">All Developers</option>
                {developers.map((developer, index) => (
                  <option
                    key={`developer-${index}-${developer}`}
                    value={developer}
                  >
                    {developer}
                  </option>
                ))}
              </select>

              <select
                className="flex-1 min-w-[180px] px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={compoundFilter}
                onChange={(e) => setCompoundFilter(e.target.value)}
              >
                <option value="all">All Compounds</option>
                {comboundata &&
                  comboundata.map((compound, index) => (
                    <option
                      key={`compound-${index}-${compound.name}`}
                      value={compound.name}
                    >
                      {compound.name}
                    </option>
                  ))}
              </select>

              <button
                onClick={handleAddBuilding}
                className="flex-shrink-0 w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center transition duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Building
              </button>
            </div>
          </div>
        </div>

        {/* Real Estate Cards */}
        {filteredEstates.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">
              No properties match your criteria. Try adjusting your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentItems.map((estate, idx) => (
              <div key={idx} className="flex flex-col">
                {/* Estate Card with fixed height */}
                <div
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-[450px] flex flex-col cursor-pointer"
                  onClick={() => handleCardClick(estate.id)}
                >
                  <div className="relative h-56">
                    {estate.images && estate.images.length > 0 ? (
                      <img
                        src={estate.images[0].url}
                        alt={estate.name || estate.compound || "Property"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={im.src}
                        alt={estate.name || estate.compound || "Property"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1 rtl:text-right">
                        {estate.compound || estate.name || "Unnamed Property"}
                      </h3>
                      <div className="flex items-center text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {estate.city || "Location not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                      {estate.bathrooms && (
                        <div className="text-sm text-gray-600 rtl:text-right">
                          <span className="font-medium">Bathrooms:</span>{" "}
                          {estate.bathrooms}
                        </div>
                      )}
                      {estate.finishing && (
                        <div className="text-sm text-gray-600 rtl:text-right">
                          <span className="font-medium">Finishing:</span>{" "}
                          {estate.finishing}
                        </div>
                      )}
                      {estate.buildingType && (
                        <div className="text-sm text-gray-600 rtl:text-right">
                          <span className="font-medium">Building Type:</span>{" "}
                          {estate.buildingType}
                        </div>
                      )}
                      {estate.downPayment && (
                        <div className="text-sm text-gray-600 rtl:text-right">
                          <span className="font-medium">Down Payment:</span>{" "}
                          {estate.downPayment}
                        </div>
                      )}

                      <button
                        onClick={() =>
                          navigate.push(`/dashbord/units/${estate.unitId}`)
                        }
                        className="w-full py-2 px-4 bg-primary text-white rounded-md font-medium transition duration-300 flex items-center justify-center text-sm mt-2"
                      >
                        <Eye className="mr-2 w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination remains the same */}
        {filteredEstates.length > 0 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center bg-white px-4 py-3 rounded-xl shadow-lg">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`mx-1 p-2 rounded-full ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-primary hover:bg-primary/10 border border-gray-200"} transition-all duration-300 flex items-center justify-center`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {getPaginationNumbers().map((pageNumber) => (
                <button
                  key={`page-${pageNumber}`}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`mx-1 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                    currentPage === pageNumber
                      ? "bg-primary text-white font-medium shadow-md transform scale-110"
                      : "text-gray-700 hover:bg-primary/10 border border-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`mx-1 p-2 rounded-full ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-primary hover:bg-primary/10 border border-gray-200"} transition-all duration-300 flex items-center justify-center`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}

        {/* Add Unit Modal */}
        <AddUnitModal
          developersData={developersData}
          comboundata={comboundata}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveUnit}
        />
      </div>
    </div>
  );
};

export default RealEstateListings;
