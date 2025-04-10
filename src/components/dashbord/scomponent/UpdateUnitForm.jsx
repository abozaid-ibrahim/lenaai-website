"use client";
import { updateUnit, uploadImages, deleteImage } from "@/components/services/serviceFetching";
import React, { useState, useEffect, useRef } from "react";
import { Trash2, Upload, Plus, X } from "lucide-react";
import propertyEnums from "../data/propertyEnums.json";
import PaymentPlanPopup from "./PaymentPlanPopup";

const UpdateUnitForm = ({ unit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    unitTitle: "",
    unitId: "",
    buildingType: "",
    city: "",
    country: "",
    compound: "",
    developer: "",
    purpose: "",
    finishing: "",
    view: "",
    floor: "",
    roomsCount: "",
    bathroomCount: "",
    landArea: "",
    gardenSize: "",
    garageArea: "",
    totalPrice: "",
    downPayment: "",
    paymentPlans: "",
    deliveryDate: "",
    clientId: "",
    clientName: "",
    dataSource: "",
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (unit) {
      setFormData({
        unitTitle: unit.unitTitle || "",
        unitId: unit.unitId || "",
        buildingType: unit.buildingType || "",
        city: unit.city || "",
        country: unit.country || "",
        compound: unit.compound || "",
        developer: unit.developer || "",
        purpose: unit.purpose || "",
        finishing: unit.finishing || "",
        view: unit.view || "",
        floor: unit.floor || 0,
        roomsCount: unit.roomsCount || 0,
        bathroomCount: unit.bathroomCount || 0,
        landArea: unit.landArea || 0,
        gardenSize: unit.gardenSize || 0,
        garageArea: unit.garageArea || 0,
        totalPrice: unit.totalPrice || 0,
        downPayment: unit.downPayment || 0,
        paymentPlans: unit.paymentPlans || "",
        deliveryDate: unit.deliveryDate ? unit.deliveryDate.split('T')[0] : "",
        clientId: unit.clientId || "",
        clientName: unit.clientName || "",
        dataSource: unit.dataSource || "",
        images: unit.images || [],
        updatedAt: unit.updatedAt || "",
      });
    }
  }, [unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset file input to allow reselecting the same file
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelection = (files) => {
    if (!files || files.length === 0) return;

    // Convert FileList to Array and take only the first file for single image upload
    const newFile = Array.from(files).slice(0, 1);

    // Store the selected file without uploading immediately
    setSelectedFiles(newFile);
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploadingImages(true);

    try {
      const formDataToUpload = new FormData();

      // Add the file with the key 'file'
      formDataToUpload.append("file", selectedFiles[0]);

      // استخدام وظيفة uploadImages من serviceFetching
      const uploadedImages = await uploadImages(formDataToUpload);

      // التعامل مع الاستجابة
      const imagesArray = Array.isArray(uploadedImages)
        ? uploadedImages
        : [uploadedImages];

      // Update formData values
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imagesArray]
      }));

      setSelectedFiles([]);
      resetFileInput();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = async (index, imageId) => {
    try {
      // استخدام وظيفة deleteImage من serviceFetching
      await deleteImage(imageId);

      // Remove from formData state after successful API deletion
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        images: updatedImages
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents the page from reloading
    console.log("formData", formData);
    onSubmit(formData);
    return false; // Extra measure to prevent form submission
  };

  const [isPaymentPlanPopupOpen, setIsPaymentPlanPopupOpen] = useState(false);
  
  const handleAddPaymentPlan = (plan) => {
    const currentPlans = formData.paymentPlans ? formData.paymentPlans.split(", ") : [];
    
    // Check if plan already exists
    if (!currentPlans.includes(plan)) {
      const updatedPlans = [...currentPlans, plan].join(", ");
      setFormData(prev => ({
        ...prev,
        paymentPlans: updatedPlans
      }));
    }
    
    setIsPaymentPlanPopupOpen(false);
  };

  const handleRemovePaymentPlan = (indexToRemove) => {
    const currentPlans = formData.paymentPlans.split(", ");
    const updatedPlans = currentPlans.filter((_, index) => index !== indexToRemove).join(", ");
    
    setFormData(prev => ({
      ...prev,
      paymentPlans: updatedPlans
    }));
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="mt-4">
      {/* Basic Information Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Title
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Building Type
            </label>
            <select
              name="buildingType"
              value={formData.buildingType}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Building Type</option>
              {propertyEnums.EnumBuildingType.map((type, index) => (
                <option key={index} value={type.charAt(0).toUpperCase() + type.slice(1)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Purpose</option>
              {propertyEnums.EnumPropertyIntent.map((intent, index) => (
                <option key={index} value={intent.charAt(0).toUpperCase() + intent.slice(1)}>
                  {intent.charAt(0).toUpperCase() + intent.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compound
            </label>
            <input
              type="text"
              name="compound"
              value={formData.compound}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              View
            </label>
            <select
              name="view"
              value={formData.view}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select View</option>
              {propertyEnums.EnumViewType.map((view, index) => (
                <option key={index} value={view.charAt(0).toUpperCase() + view.slice(1)}>
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Pricing & Payment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Price
            </label>
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment
            </label>
            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Payment Plans
              </label>
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
                <p className="text-sm text-gray-500 italic">
                  No payment plans added yet.
                </p>
              ) : (
                formData.paymentPlans
                  .split(", ")
                  .map((plan, index) => (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Property Details Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Property Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rooms Count
            </label>
            <input
              type="number"
              name="roomsCount"
              value={formData.roomsCount}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathroom Count
            </label>
            <input
              type="number"
              name="bathroomCount"
              value={formData.bathroomCount}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor
            </label>
            <input
              type="number"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Land Area (m²)
            </label>
            <input
              type="number"
              name="landArea"
              value={formData.landArea}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Garden Size (m²)
            </label>
            <input
              type="number"
              name="gardenSize"
              value={formData.gardenSize}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Garage Area (m²)
            </label>
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
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Additional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Finishing Type
            </label>
            <select
              name="finishing"
              value={formData.finishing}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select Finishing</option>
              {propertyEnums.EnumFinishingType.map((type, index) => (
                <option key={index} value={type.charAt(0).toUpperCase() + type.slice(1)}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Developer
            </label>
            <input
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Hidden fields */}
          <input
            type="hidden"
            name="dataSource"
            value={formData.dataSource || "website"}
          />
          <input
            type="hidden"
            name="clientId"
            value={formData.clientId}
          />
          <input
            type="hidden"
            name="clientName"
            value={formData.clientName}
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Property Images
        </h3>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">
            Drag and drop images here, or click to select files
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: JPG, PNG, WEBP (Max 5MB each)
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelection(e.target.files);
              }
            }}
            onClick={(e) => {
              e.target.value = "";
            }}
          />
          <label
            htmlFor="image-upload"
            className="mt-4 inline-block px-4 py-2 bg-primary cursor-pointer hover:bg-primary/90 text-white rounded-lg transition-colors mr-2"
          >
            {selectedFiles.length > 0 ? "Change Image" : "Select Image"}
          </label>
          
          {selectedFiles.length > 0 && (
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={uploadingImages}
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {uploadingImages ? "Uploading..." : "Upload Image"}
            </button>
          )}
        </div>

        {/* Display selected files waiting to be uploaded */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                Selected Image:
              </h4>
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
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Uploaded Images:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
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
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors shadow-md mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-md"
        >
          Update Unit
        </button>
      </div>
    </form>
    
    {/* Payment Plan Popup - Moved outside the form to prevent nested form error */}
    <PaymentPlanPopup
      isOpen={isPaymentPlanPopupOpen}
      onClose={() => setIsPaymentPlanPopupOpen(false)}
      onAdd={handleAddPaymentPlan}
    />
    </>
  );
};

export default UpdateUnitForm;
