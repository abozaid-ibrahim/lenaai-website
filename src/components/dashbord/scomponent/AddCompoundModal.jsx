"use client"
import React, { useState } from 'react';
import { X, Upload, MapPin, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AddCompoundModal = ({ isOpen, onClose, onSave, developers = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    developer_name: '',
    city: '',
    country: 'Egypt',
    area: 0,
    gated: false,
    video_url: '',
    google_map_link: '',
    master_plan: null
  });

  const [newDeveloper, setNewDeveloper] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletingImage, setDeletingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById('masterPlanImage');
    if (fileInput) fileInput.value = '';
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    resetFileInput();
  };

  const handleImageUpload = async () => {
    // if (!selectedFile) return;
    
    setUploadingImage(true);
    try {
      const imageFormData = new FormData();
      imageFormData.append('file', selectedFile);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/images/`, imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const uploadedImage = Array.isArray(response.data) ? response.data[0] : response.data;
      setFormData(prev => ({ ...prev, master_plan: uploadedImage }));
      setSelectedFile(null);
      resetFileInput();
      
      toast.success("Master plan uploaded successfully");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeUploadedImage = async () => {
    setDeletingImage(true);
    try {
      // Delete from API
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/images/${formData.master_plan.fileId}`);
      
      // Remove from state after successful API deletion
      setFormData(prev => ({ ...prev, master_plan: null }));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    } finally {
      setDeletingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create a new object with the correct format for submission
      const submissionData = {
        ...formData,
        // Use the URL property from master_plan object if it exists
        master_plan: formData.master_plan ? formData.master_plan.url : null
      };
      
      // Send POST request to the projects endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/`, 
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Call the onSave function provided by the parent component with the response data
      if (onSave) {
        onSave(response.data);
      }
      
      // Show success message
      toast.success("Compound added successfully");
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || "Failed to add compound");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#d4b978] z-10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New Compound</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#c4aa68] transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compound Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="3"
            />
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
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select City</option>
              <option value="Cairo">Cairo</option>
              <option value="Alexandria">Alexandria</option>
              <option value="مدينتي">مدينتي</option>
              <option value="New Cairo">New Cairo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
            <div className="flex">
              <input
                type="url"
                name="google_map_link"
                value={formData.google_map_link}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
              <button 
                type="button"
                className="bg-gray-100 px-3 rounded-r-lg border border-l-0 border-gray-300 hover:bg-gray-200"
                title="Open Maps"
              >
                <MapPin className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Developer</label>
            {!newDeveloper ? (
              <div className="flex gap-2">
                <select
                  name="developer_name"
                  value={formData.developer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Developer</option>
                  {developers.length > 0 ? (
                    developers.map(dev => (
                      <option key={dev.id} value={dev.name}>{dev.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Talaat Mostafa Group (TMG) - طلعت مصطفى">Talaat Mostafa Group (TMG) - طلعت مصطفى</option>
                      <option value="SODIC">SODIC</option>
                      <option value="Emaar">Emaar</option>
                      <option value="Palm Hills">Palm Hills</option>
                    </>
                  )}
                </select>
                <button 
                  type="button" 
                  onClick={() => setNewDeveloper(true)}
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 text-sm"
                >
                  New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="developer_name"
                  value={formData.developer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter developer name"
                />
                <button 
                  type="button" 
                  onClick={() => setNewDeveloper(false)}
                  className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 text-sm"
                >
                  Select
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Master Plan Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="masterPlanImage"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {/* When no file is selected or uploaded */}
              {!selectedFile && !formData.master_plan && (
                <label 
                  htmlFor="masterPlanImage"
                  className="cursor-pointer flex flex-col items-center justify-center py-3"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">لم يتم اختيار أي ملف</span>
                  <span className="text-xs text-gray-400 mt-1">اختيار ملف</span>
                </label>
              )}
              
              {/* When file is selected but not uploaded yet */}
              {selectedFile && (
                <div className="py-3">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500"
                      title="Remove selected file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50"
                  >
                    {uploadingImage ? 'جاري الرفع...' : 'رفع الصورة'}
                  </button>
                </div>
              )}
              
              {/* When file is already uploaded */}
              {formData.master_plan && (
                <div className="py-3">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-lg">
                      <span className="text-sm">✓ تم رفع الصورة بنجاح</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeUploadedImage}
                      disabled={deletingImage}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500"
                      title="Delete image"
                    >
                      {deletingImage ? (
                        <span className="text-xs">جاري الحذف...</span>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="gated"
              name="gated"
              checked={formData.gated}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="gated" className="ml-2 text-sm font-medium text-gray-700">
              Gated Community
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#d4b978] hover:bg-[#c4aa68] text-gray-800 font-medium rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'Save Compound'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompoundModal;