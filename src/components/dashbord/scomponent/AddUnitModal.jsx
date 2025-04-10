"use client";
import React from "react";
import { X, Upload, Trash2, Plus } from "lucide-react";
import AddCompoundModal from "./AddCompoundModal";
import PaymentPlanPopup from "./PaymentPlanPopup";
import { useUnitForm } from "../hooks/useUnitForm";
import propertyEnums from "../data/propertyEnums.json";

const AddUnitModal = ({
  isOpen,
  onClose,
  onSave,
  comboundata,
  developersData,
}) => {
  const {
    formik,
    isAddCompoundModalOpen,
    uploadingImages,
    selectedFiles,
    isPaymentPlanPopupOpen,
    fileInputRef,
    setIsAddCompoundModalOpen,
    setIsPaymentPlanPopupOpen,
    handleFileSelection,
    handleImageUpload,
    removeSelectedFile,
    removeUploadedImage,
    handleDrop,
    handleAddPaymentPlan,
    handleRemovePaymentPlan,
    handleDragOver,
    handleCompoundSave,
  } = useUnitForm(onClose, onSave);

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

        <form onSubmit={formik.handleSubmit} className="p-6">
          {/* Client Information - Removed clientName field */}
          {/* Hidden clientId field is maintained */}
          <input type="hidden" name="clientId" value={formik.values.clientId} />

          {/* Property Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Property Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compound
                  </label>
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
                  value={formik.values.compound}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.compound && formik.errors.compound
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                >
                  <option value="">Select Compound</option>
                  {comboundata &&
                    comboundata.map((compound, index) => (
                      <option key={index} value={compound.name}>
                        {compound.name}
                      </option>
                    ))}
                </select>
                {formik.touched.compound && formik.errors.compound && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.compound}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Title
                </label>
                <input
                  type="text"
                  name="unitTitle"
                  value={formik.values.unitTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.unitTitle && formik.errors.unitTitle
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.unitTitle && formik.errors.unitTitle && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.unitTitle}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building Type
                </label>
                <select
                  name="buildingType"
                  value={formik.values.buildingType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.buildingType && formik.errors.buildingType
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                >
                  <option value="">Select Building Type</option>
                  {propertyEnums.EnumBuildingType.map((type, index) => (
                    <option key={index} value={type.charAt(0).toUpperCase() + type.slice(1)}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                {formik.touched.buildingType && formik.errors.buildingType && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.buildingType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <select
                  name="purpose"
                  value={formik.values.purpose}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.purpose && formik.errors.purpose
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                >
                  <option value="">Select Purpose</option>
                  {propertyEnums.EnumPropertyIntent.map((intent, index) => (
                    <option key={index} value={intent.charAt(0).toUpperCase() + intent.slice(1)}>
                      {intent.charAt(0).toUpperCase() + intent.slice(1)}
                    </option>
                  ))}
                </select>
                {formik.touched.purpose && formik.errors.purpose && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.purpose}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.city && formik.errors.city
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formik.values.district}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.district && formik.errors.district
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.district && formik.errors.district && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.district}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  View
                </label>
                <select
                  name="view"
                  value={formik.values.view}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.view && formik.errors.view
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                >
                  <option value="">Select View</option>
                  {propertyEnums.EnumViewType.map((view, index) => (
                    <option key={index} value={view.charAt(0).toUpperCase() + view.slice(1)}>
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </option>
                  ))}
                </select>
                {formik.touched.view && formik.errors.view && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.view}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Financial Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Down Payment
                </label>
                <input
                  type="number"
                  name="downPayment"
                  min="0"
                  value={formik.values.downPayment}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.downPayment && formik.errors.downPayment
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.downPayment && formik.errors.downPayment && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.downPayment}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formik.values.deliveryDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.deliveryDate && formik.errors.deliveryDate
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.deliveryDate && formik.errors.deliveryDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.deliveryDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price
                </label>
                <input
                  type="number"
                  name="totalPrice"
                  min="0"
                  value={formik.values.totalPrice}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.totalPrice && formik.errors.totalPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.totalPrice && formik.errors.totalPrice && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.totalPrice}
                  </p>
                )}
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
                  {!formik.values.paymentPlans ? (
                    <p className="text-sm text-gray-500 italic">
                      No payment plans added yet.
                    </p>
                  ) : (
                    formik.values.paymentPlans
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
                {formik.touched.paymentPlans && formik.errors.paymentPlans && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.paymentPlans}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Property Specifications Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Property Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rooms
                </label>
                <input
                  type="number"
                  name="roomsCount"
                  min="0"
                  value={formik.values.roomsCount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.roomsCount && formik.errors.roomsCount
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.roomsCount && formik.errors.roomsCount && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.roomsCount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathroomCount"
                  min="0"
                  value={formik.values.bathroomCount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.bathroomCount && formik.errors.bathroomCount
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.bathroomCount &&
                  formik.errors.bathroomCount && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.bathroomCount}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor
                </label>
                <input
                  type="number"
                  name="floor"
                  min="0"
                  value={formik.values.floor}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.floor && formik.errors.floor
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.floor && formik.errors.floor && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.floor}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Land Area (m²)
                </label>
                <input
                  type="number"
                  name="landArea"
                  min="0"
                  value={formik.values.landArea}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.landArea && formik.errors.landArea
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.landArea && formik.errors.landArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.landArea}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garden Size (m²)
                </label>
                <input
                  type="number"
                  name="gardenSize"
                  min="0"
                  value={formik.values.gardenSize}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.gardenSize && formik.errors.gardenSize
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.gardenSize && formik.errors.gardenSize && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.gardenSize}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garage Area (m²)
                </label>
                <input
                  type="number"
                  name="garageArea"
                  min="0"
                  value={formik.values.garageArea}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value < 0) e.target.value = 0;
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formik.touched.garageArea && formik.errors.garageArea
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-primary"
                  } focus:border-transparent`}
                />
                {formik.touched.garageArea && formik.errors.garageArea && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.garageArea}
                  </p>
                )}
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
                  value={formik.values.finishing}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Finishing</option>
                  <option value="Fully Finished">Fully Finished</option>
                  <option value="Semi Finished">Semi Finished</option>
                  <option value="Core & Shell">Core & Shell</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Developer
                </label>
                <select
                  name="developer"
                  value={formik.values.developer}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Developer</option>
                  {developersData &&
                    developersData.map((developer, index) => (
                      <option key={index} value={developer.name}>
                        {developer.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Hidden dataSource field */}
              <input
                type="hidden"
                name="dataSource"
                value={formik.values.dataSource || "website"}
              />

              {/* Removed visible dataSource input field */}
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
                  // This clears the input value when the user clicks on it
                  // allowing the same file to be selected again
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
                  {/* Removed duplicate upload button */}
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
            {formik.values.images.length > 0 && (
              <div className="mt-4 ">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formik.values.images.map((image, index) => (
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
        developersData={developersData}
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
