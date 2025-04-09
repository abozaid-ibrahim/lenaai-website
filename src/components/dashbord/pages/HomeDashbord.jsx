"use client"
import React, { useState } from 'react';
import { Search, Filter, MessageSquare, Phone, Home, Calendar, CheckCircle, X, Eye, ChevronDown } from 'lucide-react';
import formatDateForDisplay from '@/utils/formateDate';
import PropertyDetailsModal from '../scomponent/PropertyDetailsModal';
import { useFormik } from 'formik';
import axios from 'axios';
import toast from 'react-hot-toast';

const RealEstateDashboard = ({ userData }) => {
  let chatHistory = {};
  let userRequirements = {};
  const structuredUserData = userData?.map((user) => {

    const messages = user.conversation
    chatHistory[user.phoneNumber] = messages;

    // adding user requirements
    userRequirements[user.phoneNumber] = user.requirements;
    // adding date
    const lastMessage = messages[messages.length - 1];

    // adding action
    const userAction = user.actions.action ? user.actions.action : "No Action";

    return {
      id: user.phoneNumber,
      phone: user.phoneNumber,
      date: formatDateForDisplay(lastMessage.timestamp),
      requirements: "Requirements",
      messageCount: messages.length,
      status: userAction
    }
  })

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

  const [leads, setLeads] = useState(structuredUserData);
  const [activeTab, setActiveTab] = useState('All Chats');
  const [searchTerm, setSearchTerm] = useState('');

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
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  // Handle date filter changes
  const handleDateFilterChange = () => {
    const formattedStartDate = formatDateForDisplay(startDate);
    const formattedEndDate = formatDateForDisplay(endDate);
    setDisplayDateRange(`${formattedStartDate} - ${formattedEndDate}`);

    // Filter leads based on date range
    const filteredByDate = initialLeads?.filter(lead => {
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
  };

  // Filter leads based on active tab and search
  const filteredLeads = leads?.filter(lead => {
    if (activeTab === 'All Chats') return true;
    if (activeTab === 'Recent Chats') return new Date(lead.date.split('-').reverse().join('-')) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (activeTab === 'Needs Action') return ['Missing Info', 'Schedule Call', 'Make a Call', 'Book Viewing'].includes(lead.status);
    if (activeTab === 'NO Action') return ['Not Interested', 'Not Qualified'].includes(lead.status);
    return true;
  }).filter(lead => {
    if (!searchTerm) return true;
    return lead.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
  });

  const [loading, setLoading] = useState(false);
  const [isOpenmodle, setIsOpenmodle] = useState(false);

  const formik = useFormik({
    initialValues: {
      spreadsheet_url: "",
      media_url: ""
    },
    onSubmit: async (values) => {
      const requestLinkData = {
        spreadsheet_url: values.spreadsheet_url,
        media_url: values.media_url,
        sheet_name: "Sheet1",
        client_id: "ALL"
      };

      try {
        setLoading(true);
        const response = await axios.post(
          "https://api.lenaai.net/webhook/send-video-using-spreadsheet",
          requestLinkData,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        toast.success(response.data);
      } catch (error) {
        toast.error(error?.message);
        console.error(error?.message);
      } finally {
        setLoading(false);
        formik.resetForm();
      }
    }
  });












  const formikinput = useFormik({
    initialValues: {
      value1: "", // select input
      value2: "", // text input
    },
    onSubmit: async (values) => {
      const requestLinkData = {
        value1: values.value1,
        value2: values.value2,
      };

      try {
        setLoading(true);
        const response = await axios.post("URL", requestLinkData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success(response.data);
      } catch (error) {
        toast.error(error?.message);
        console.error(error?.message);
      } finally {
        setLoading(false);
        formikinput.resetForm();
      }
    },
  });

















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
            <div className="relative inline-block">
              <button
                onClick={handleOpenModal}
                className="w-full cursor-pointer sm:w-auto bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                WhatsApp Leads
              </button>


              {isOpen && (
                <div className="fixed inset-0 bg-[#00000042] bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
                    {/* إغلاق */}
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 mt-4"
                    >
                      <X size={20} />
                    </button>

                    <h2 className="text-lg font-semibold mb-2">  Send Cold Whats Messages Patch</h2>
                    <div>

                      <form onSubmit={formik.handleSubmit}>
                        <div className="grid gap-12 mb-6 mt-5 mb-5">
                          <div>
                            <label htmlFor="spreadsheet_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Link or File
                            </label>
                            <input
                              type="text"
                              id="spreadsheet_url"
                              name="spreadsheet_url"
                              onChange={formik.handleChange}
                              value={formik.values.spreadsheet_url}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Spreadsheet Link"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="media_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Video Link
                            </label>
                            <input
                              type="text"
                              id="media_url"
                              name="media_url"
                              onChange={formik.handleChange}
                              value={formik.values.media_url}
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Video Link"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                          >
                            {loading ? "Sending..." : "Send"}
                          </button>
                        </div>
                      </form>

                    </div>

                    <div className="flex justify-end gap-2">
                      {/* <button
                        onClick={handleCloseModal}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={() => {
                          // من هنا ترسل رسائل واتساب
                          console.log("تم الإرسال...");
                          setIsOpen(false);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                      >
                        إرسال
                      </button> */}
                    </div>
                  </div>
                </div>
              )}


            </div>

          </div>

          
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
                    {filteredLeads?.map((lead) => {
                      const statusStyle = getStatusStyle(lead.status);
                      return (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors text-xs sm:text-sm">
                          <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium text-gray-900">
                            <div className="flex flex-col sm:hidden">
                              <span>{lead.name}</span>
                              <span className="text-xs text-gray-500">{lead.phone}</span>
                              <span
                                className="text-xs text-blue-600 cursor-pointer hover:underline"
                                onClick={() => openPropertyDetails(lead.requirements)}
                              >
                                {lead.requirements}
                              </span>
                            </div>
                            <span className="hidden sm:inline">{lead.name}</span>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 hidden sm:table-cell">{lead.phone}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600">{lead.date}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                            <span
                              className="text-blue-600 cursor-pointer hover:underline"
                              onClick={() => openPropertyDetails(lead.requirements)}
                            >
                              {lead.requirements}
                            </span>
                          </td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-medium">{lead.messageCount}</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3">
                            <div className="flex justify-center">
                              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${statusStyle.bgColor}`}>
                                {/* {statusStyle.icon}
                                {lead.status} */}
                                <button
                                  type="button"
                                  onClick={() => setIsOpenmodle(true)}
                                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 cursor-pointer py-1.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                  Action
                                </button>
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


          {isOpenmodle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000042] bg-opacity-50">
              <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">

                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl font-semibold  dark:text-white">
                      change Action
                    </h3>
                    <button
                      onClick={() => setIsOpenmodle(false)}
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>

                  <div className="p-4 md:p-5 space-y-4">
                    <form className="max-w-md mx-auto" onSubmit={formikinput.handleSubmit}>
                      {/* Select Field */}
                      <label htmlFor="value1" className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        Action
                      </label>
                      <select
                        id="value1"
                        name="value1"
                        onChange={formikinput.handleChange}
                        value={formikinput.values.value1}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                      >
                        <option value="">Select an option</option>
                        <option value="Action1">Action1</option>
                        <option value="Canada2">Canada2</option>
                        <option value="France3">France3</option>
                        <option value="Germany4">Germany4</option>
                      </select>

                      {/* Text Input */}
                      <div className="mt-5">
                        <label htmlFor="value2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Comment
                        </label>
                        <input
                          type="text"
                          id="value2"
                          name="value2"
                          onChange={formikinput.handleChange}
                          value={formikinput.values.value2}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5
            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="comment"
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
                      >
                        send
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          )}

          {filteredLeads?.length === 0 && (
            <div className="text-center py-8 sm:py-10">
              <p className="text-gray-500 text-sm sm:text-base">لا توجد بيانات تطابق التصفية الحالية</p>
              <button
                onClick={resetFilters}
                className="mt-3 text-blue-600 text-sm hover:text-blue-800"
              >
                إعادة ضبط التصفية
              </button>
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