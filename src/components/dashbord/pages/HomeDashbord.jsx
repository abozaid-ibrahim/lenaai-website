"use client"
import React, { useState } from 'react';
import { Search, Filter, MessageSquare, Phone, Home, Calendar, CheckCircle, X, Eye, ChevronDown } from 'lucide-react';
import formatDateForDisplay from '@/utils/formateDate';
import PropertyDetailsModal from '../scomponent/PropertyDetailsModal';
import { fetchUsers } from '@/components/services/serviceFetching';
import { useRouter } from 'next/navigation';
const RealEstateDashboard = ({ users }) => {

  // Sample data
  const router = useRouter();
  const [usersData, setUsersData] = useState(users.users);
  const [hasMore, setHasMore] = useState(users?.pagination?.has_more);
  const [nextCursor, setNextCursor] = useState(users?.pagination?.next_cursor);
  const [previousCursor, setPreviousCursor] = useState(null);
  // Sample property details data
  const propertyDetails = {
    "Three Bedroom": {
      title: "Three Bedroom Apartment in Madinaty",
      buildingType: "Apartment",
      landArea: "200m²",
      floor: "3rd Floor",
      roomsCount: "3",
      bathroomCount: "2",
      view: "Garden View",
      gardenSize: "120m²",
      finishing: "Fully Finished",
      developer: "Dream House",
      downPayment: "50,000 EGP",
      deliveryYear: "2026",
      totalPrice: "1,500,000 EGP",
      contactName: "Dream House Agent",
      lastUpdate: "01-04-2025",
      forRentSale: "Rent"
    },
    "Apartment": {
      title: "Modern Apartment in New Cairo",
      buildingType: "Apartment",
      landArea: "150m²",
      floor: "5th Floor",
      roomsCount: "2",
      bathroomCount: "1",
      view: "City View",
      gardenSize: "0m²",
      finishing: "Semi Finished",
      developer: "SODIC",
      downPayment: "300,000 EGP",
      deliveryYear: "2025",
      totalPrice: "2,000,000 EGP",
      contactName: "SODIC Development",
      lastUpdate: "28-03-2025",
      forRentSale: "Sale"
    },
    "Townhouse": {
      title: "Luxury Townhouse in Sheikh Zayed",
      buildingType: "Townhouse",
      landArea: "250m²",
      floor: "2 Floors",
      roomsCount: "4",
      bathroomCount: "3",
      view: "Garden View",
      gardenSize: "100m²",
      finishing: "Fully Finished",
      developer: "Palm Hills",
      downPayment: "1,000,000 EGP",
      deliveryYear: "2024",
      totalPrice: "5,000,000 EGP",
      contactName: "Palm Hills Developments",
      lastUpdate: "15-03-2025",
      forRentSale: "Sale"
    },
    "Villa": {
      title: "Spacious Villa in Katameya Heights",
      buildingType: "Villa",
      landArea: "500m²",
      floor: "2 Floors",
      roomsCount: "5",
      bathroomCount: "4",
      view: "Golf Course",
      gardenSize: "300m²",
      finishing: "Fully Finished",
      developer: "Emaar",
      downPayment: "2,000,000 EGP",
      deliveryYear: "2023",
      totalPrice: "10,000,000 EGP",
      contactName: "Emaar Properties",
      lastUpdate: "20-03-2025",
      forRentSale: "Sale"
    }
  };

  // const [leads, setLeads] = useState(initialLeads);
  const [activeTab, setActiveTab] = useState('All Chats');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Date filter states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('2025-03-26');
  const [endDate, setEndDate] = useState('2025-04-12');
  const [displayDateRange, setDisplayDateRange] = useState('26 Mar 25 - 12 Apr 25');

  // Function to open property details modal
  const openPropertyDetails = (requirement) => {
    const property = propertyDetails[requirement] || propertyDetails["Apartment"]; // Fallback
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  // Handle date filter changes
  const handleDateFilterChange = () => {
    const formattedStartDate = formatDateForDisplay(startDate);
    const formattedEndDate = formatDateForDisplay(endDate);
    setDisplayDateRange(`${formattedStartDate} - ${formattedEndDate}`);

    // Filter leads based on date range
    const filteredByDate = initialLeads.filter(lead => {
      const [day, month, year] = lead.date.split('-');
      const leadDate = new Date(`20${year}-${month}-${day}`);
      return leadDate >= new Date(startDate) && leadDate <= new Date(endDate);
    });

    setLeads(filteredByDate);
    setShowDatePicker(false);
  };

  // Reset to all leads
  const resetFilters = () => {
    setLeads(initialLeads);
    setSearchTerm('');
    setCurrentPage(1); // Reset to first page when filters are reset
  };

  // Filter leads based on active tab and search
  // const filteredLeads = leads.filter(lead => {
  //   if (activeTab === 'All Chats') return true;
  //   if (activeTab === 'Recent Chats') return new Date(lead.date.split('-').reverse().join('-')) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  //   if (activeTab === 'Needs Action') return ['Missing Info', 'Schedule Call', 'Make a Call', 'Book Viewing'].includes(lead.status);
  //   if (activeTab === 'NO Action') return ['Not Interested', 'Not Qualified'].includes(lead.status);
  //   return true;
  // }).filter(lead => {
  //   if (!searchTerm) return true;
  //   return lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     lead.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     lead.phone.includes(searchTerm);
  // });

  // Calculate pagination
  // const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentLeads = filteredLeads.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNextPage = async () => {
    if (hasMore) {
      setPreviousCursor(nextCursor);
      setCurrentPage(currentPage + 1);
      const nextUsers = await fetchUsers(nextCursor);
      setUsersData(
        [
          ...nextUsers.users
        ]
      );
      setNextCursor(nextUsers.pagination.next_cursor);
      setHasMore(nextUsers.pagination.has_more);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
//   const filteredLeads = leads.filter(lead => {
//     if (activeTab === 'All Chats') return true;
//     if (activeTab === 'Recent Chats') return new Date(lead.date.split('-').reverse().join('-')) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//     if (activeTab === 'Needs Action') return ['Missing Info', 'Schedule Call', 'Make a Call', 'Book Viewing'].includes(lead.status);
//     if (activeTab === 'NO Action') return ['Not Interested', 'Not Qualified'].includes(lead.status);
//     return true;
//   }).filter(lead => {
//     if (!searchTerm) return true;
//     return lead.phone.toLowerCase().includes(searchTerm.toLowerCase()) || 
//            lead.requirements.toLowerCase().includes(searchTerm.toLowerCase()) || 
//            lead.phone.includes(searchTerm);
//   });

  // Get status color and icon
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Follow up later':
        return { bgColor: 'bg-gray-100 text-gray-700', icon: <MessageSquare size={14} className="mr-1" /> };
      case 'Not interested':
        return { bgColor: 'bg-gray-200 text-gray-700', icon: <X size={14} className="mr-1" /> };
      case 'Missing requirement':
        return { bgColor: 'bg-orange-500 text-white', icon: <Filter size={14} className="mr-1" /> };
      case 'Property view':
        return { bgColor: 'bg-blue-200 text-blue-700', icon: <Eye size={14} className="mr-1" /> };
      case 'Office visit':
        return { bgColor: 'bg-green-100 text-green-700', icon: <Home size={14} className="mr-1" /> };
      case 'Qualified lead':
        return { bgColor: 'bg-teal-500 text-white', icon: <CheckCircle size={14} className="mr-1" /> };
      case 'Book Viewing':
        return { bgColor: 'bg-red-500 text-white', icon: <Calendar size={14} className="mr-1" /> };
      case 'Schedule Call':
        return { bgColor: 'bg-blue-400 text-white', icon: <Calendar size={14} className="mr-1" /> };
      case 'Make a call':
        return { bgColor: 'bg-green-600 text-white', icon: <Phone size={14} className="mr-1" /> };
      case 'Not qualified':
        return { bgColor: 'bg-gray-500 text-white', icon: <X size={14} className="mr-1" /> };
      default:
        return { bgColor: 'bg-gray-100', icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="p-3 sm:p-4 md:p-6">
          {/* Header with tabs and WhatsApp button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div className="flex flex-wrap w-full sm:w-auto overflow-x-auto bg-gray-100 p-1 rounded-lg">
              {['All Chats', 'Recent Chats', 'Needs Action', 'NO Action'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${activeTab === tab
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2">
              <MessageSquare size={16} />
              WhatsApp Leads
            </button>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, number, or requirements"
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
              >
                <Filter size={16} />
                <span className="hidden xs:inline">Filter</span>
              </button>

              {/* Date filter with dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <span className="hidden sm:inline">{displayDateRange}</span>
                  <span className="sm:hidden">Date</span>
                  <ChevronDown size={14} />
                </button>

                {showDatePicker && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full border border-gray-200 rounded-md p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full border border-gray-200 rounded-md p-2 text-sm"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleDateFilterChange}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table with responsive design */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr className="text-left text-xs sm:text-sm font-medium text-gray-600">
                      <th className="px-2 sm:px-4 py-2 sm:py-3">Name</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">User Number</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3">Date</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">Requirements</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center"><MessageSquare size={16} /></th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersData?.map((user) => {
                      const lastMessage = user.conversation?.[0]?.user_message || '';
                      const lastActivity = new Date(user.lastActivity).toLocaleDateString();
                      const requirements = user.requirements?.userBuildingType?.[0] || 'Not specified';
                      const messageCount = user.conversation?.length || 0;
                      const status = user.profile?.Score?.details?.buyer?.category || 'Cold';

                      return (
                        <tr onClick={() => router.push(`/dashbord/chat/history/${user.phoneNumber}`)} key={user.phoneNumber} className="hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                          <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-900">
                            <div className="flex flex-col sm:hidden">
                              <span className="text-xs text-gray-500">{user.phoneNumber}</span>
                              <span
                                className="text-xs text-blue-600 cursor-pointer hover:underline"
                                onClick={() => openPropertyDetails(requirements)}
                              >
                                {requirements}
                              </span>
                            </div>
                            <span className="hidden sm:inline">{user.phoneNumber}</span>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 hidden sm:table-cell">{user.phoneNumber}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600">{lastActivity}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                            <span
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => openPropertyDetails(requirements)}
                            >
                              {requirements}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium">{messageCount}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${status === 'Hot' ? 'bg-green-100 text-green-700' :
                                status === 'Warm' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                {status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination controls */}
          {usersData?.length > 0 && (
            <div className="flex justify-end items-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${hasMore
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Property Details Modal */}
      <PropertyDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default RealEstateDashboard;