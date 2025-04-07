"use client"
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import AddCompoundModal from './AddCompoundModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

// Payment plan popup component
const PaymentPlanPopup = ({ isOpen, onClose, onAdd }) => {
  const [years, setYears] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!years || !amount) return;
    
    onAdd(`${years}-Years Plan: ${amount} EGP`);
    setYears('');
    setAmount('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Payment Plan</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Number of years"
              min="1"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (EGP)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Monthly payment amount"
              min="1"
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Add Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddUnitModal = ({ isOpen, onClose, onSave, comboundata }) => {
  // Update the initial state to have paymentPlans as string
  // Update the initial state to include unitTitle
  const [formData, setFormData] = useState({
    buildingType: 'Apartment',
    purpose: 'Buy',
    compound: '',
    view: 'Lagoon',
    country: 'Egypt',
    city: '',
    clientName: '',
    clientId: 'DREAM_HOMES',
    developer: '',
    unitId: uuidv4(),
    unitTitle: '', // إضافة حقل unitTitle
    deliveryDate: '',
    bathroomCount: '',
    floor: '',
    roomsCount: '',
    landArea: '',
    gardenSize: '',
    finishing: '',
    dataSource: '',
    downPayment: '',
    totalPrice: '',
    paymentPlans: '',
    garageArea: '',
    images: []
  });

  const [isAddCompoundModalOpen, setIsAddCompoundModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isPaymentPlanPopupOpen, setIsPaymentPlanPopupOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Generate new UUID when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        unitId: uuidv4()
      }));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelection = (files) => {
    if (!files || files.length === 0) return;
    // Store the selected files without uploading immediately
    setSelectedFiles(prev => [...prev, ...Array.from(files)]);
  };

  // Reset file input to allow reselecting the same file
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploadingImages(true);
    
    try {
      const formDataToUpload = new FormData();
      
      // Add all files with the same key 'file'
      // This will ensure the backend treats 'file' as an array of files
      selectedFiles.forEach(file => {
        formDataToUpload.append('file', file);
      });
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/images/`, formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Make sure we handle both array and single object responses
      const uploadedImages = Array.isArray(response.data) ? response.data : [response.data];
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
      
      toast.success(`${uploadedImages.length} images uploaded successfully`);
      setSelectedFiles([]);
      resetFileInput();
      
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = async (index, imageId) => {
    try {
      // Delete from API
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/images/${imageId}`);
      
      // Remove from state after successful API deletion
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  // Update the handleAddPaymentPlan function to concatenate strings
  const handleAddPaymentPlan = (planText) => {
    setFormData(prev => ({
      ...prev,
      paymentPlans: prev.paymentPlans 
        ? `${prev.paymentPlans}, ${planText}` 
        : planText
    }));
  };

  // Update the handleRemovePaymentPlan function to work with string
  const handleRemovePaymentPlan = (index) => {
    const plansArray = formData.paymentPlans.split(', ');
    plansArray.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      paymentPlans: plansArray.join(', ')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert numeric fields to numbers
    const preparedFormData = {
      ...formData,
      updatedAt: new Date().toISOString(), // Add current timestamp
      bathroomCount: formData.bathroomCount ? Number(formData.bathroomCount) : 0,
      floor: formData.floor ? Number(formData.floor) : 0,
      roomsCount: formData.roomsCount ? Number(formData.roomsCount) : 0,
      landArea: formData.landArea ? Number(formData.landArea) : 0,
      gardenSize: formData.gardenSize ? Number(formData.gardenSize) : 0,
      downPayment: formData.downPayment ? Number(formData.downPayment) : 0,
      totalPrice: formData.totalPrice ? Number(formData.totalPrice) : 0,
      garageArea: formData.garageArea ? Number(formData.garageArea) : 0,
    };
    
    try {
      // إرسال البيانات إلى نقطة النهاية add-unit
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/add-unit/`, preparedFormData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success("تم إضافة الوحدة بنجاح");
        onSave(preparedFormData);
        onClose();
      }
    } catch (error) {
      console.error('Error adding unit:', error);
      toast.error(error.response?.data?.message || "فشل في إضافة الوحدة");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCompoundSave = (compoundData) => {
    // Set the newly created compound name to the unit's compound field
    setFormData(prev => ({ ...prev, compound: compoundData.compoundName }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Unit</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-primary/80 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Client Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {/* Client ID is hidden and set to DREAM_HOMES */}
              <input
                type="hidden"
                name="clientId"
                value="DREAM_HOMES"
              />
            </div>
          </div>

          {/* Property Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Compound</label>
                  <button 
                    type="button"
                    onClick={() => setIsAddCompoundModalOpen(true)}
                    className="text-xs text-primary hover:text-primary/80 mb-1"
                  >
                    + Add New
                  </button>
                </div>
                <select
                  name="compound"
                  value={formData.compound}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Compound</option>
                  {comboundata && comboundata.map((compound, index) => (
                    <option key={index} value={compound.name}>
                      {compound.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Title</label>
                <input
                  type="text"
                  name="unitTitle"
                  value={formData.unitTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Building Type</label>
                <select
                  name="buildingType"
                  value={formData.buildingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
                <select
                  name="view"
                  value={formData.view}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Lagoon">Lagoon</option>
                  <option value="Garden">Garden</option>
                  <option value="Street">Street</option>
                  <option value="Pool">Pool</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Egypt">Egypt</option>
                  <option value="UAE">UAE</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit ID (auto-generated)</label>
                <input
                  type="text"
                  name="unitId"
                  value={formData.unitId}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Financial Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                <input
                  type="number"
                  name="downPayment"
                  value={formData.downPayment}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Payment Plans</label>
                  <button
                    type="button"
                    onClick={() => setIsPaymentPlanPopupOpen(true)}
                    className="flex items-center text-xs text-primary hover:text-primary/80"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Plan
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {!formData.paymentPlans ? (
                    <p className="text-sm text-gray-500 italic">No payment plans added yet.</p>
                  ) : (
                    formData.paymentPlans.split(', ').map((plan, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        <span>{plan}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePaymentPlan(index)}
                          className="text-gray-500 hover:text-red-500 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Specifications Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Property Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                <input
                  type="number"
                  name="roomsCount"
                  value={formData.roomsCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  name="bathroomCount"
                  value={formData.bathroomCount}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Land Area (m²)</label>
                <input
                  type="number"
                  name="landArea"
                  value={formData.landArea}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Garden Size (m²)</label>
                <input
                  type="number"
                  name="gardenSize"
                  value={formData.gardenSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Garage Area (m²)</label>
                <input
                  type="number"
                  name="garageArea"
                  value={formData.garageArea}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Finishing Type</label>
                <select
                  name="finishing"
                  value={formData.finishing}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Finishing</option>
                  <option value="Fully Finished">Fully Finished</option>
                  <option value="Semi Finished">Semi Finished</option>
                  <option value="Core & Shell">Core & Shell</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Developer</label>
                <select
                  name="developer"
                  value={formData.developer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Developer</option>
                  <option value="Madinaty">Madinaty</option>
                  <option value="SODIC">SODIC</option>
                  <option value="Emaar">Emaar</option>
                  <option value="Palm Hills">Palm Hills</option>
                  <option value="Madinet Nasr Housing">Madinet Nasr Housing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Source</label>
                <input
                  type="text"
                  name="dataSource"
                  value={formData.dataSource}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Website URL, Brochure"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Property Images</h3>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Drag and drop images here, or click to select files</p>
              <p className="text-xs text-gray-400">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                id="image-upload"
                ref={fileInputRef}
                onChange={(e) => handleFileSelection(e.target.files)}
                onClick={(e) => {
                  // This clears the input value when the user clicks on it
                  // allowing the same file to be selected again
                  e.target.value = '';
                }}
              />
              <label 
                htmlFor="image-upload" 
                className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-colors mr-2"
              >
                Select Files
              </label>
            </div>
            
            {/* Display selected files waiting to be uploaded */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Selected Images:</h4>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadingImages}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    {uploadingImages ? 'Uploading...' : 'Upload Selected Images'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Selected image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Display uploaded images */}
            {formData.images.length > 0 && (
              <div className="mt-4 ">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group  ">
                      <img 
                        src={image.url || image.url} 
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(index, image.fileId)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              Save Unit
            </button>
          </div>
        </form>
      </div>

      {/* Add Compound Modal */}
      <AddCompoundModal 
        isOpen={isAddCompoundModalOpen}
        onClose={() => setIsAddCompoundModalOpen(false)}
        onSave={handleCompoundSave}
      />

      {/* Payment Plan Popup */}
      <PaymentPlanPopup
        isOpen={isPaymentPlanPopupOpen}
        onClose={() => setIsPaymentPlanPopupOpen(false)}
        onAdd={handleAddPaymentPlan}
      />
    </div>
  );
};

export default AddUnitModal;