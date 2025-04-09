"use client"
import React from 'react';
import { X, Upload, MapPin, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCompoundForm } from '../hooks/useCompoundForm';

const AddCompoundModal = ({ isOpen, onClose, onSave, developersData }) => {
  const {
    formik,
    newDeveloper,
    uploadingImage,
    selectedFile,
    deletingImage,
    fileInputRef,
    handleFileSelect,
    removeSelectedFile,
    handleImageUpload,
    removeUploadedImage,
    setNewDeveloper
  } = useCompoundForm(onClose, onSave);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary z-10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Add New Compound</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            disabled={formik.isSubmitting}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compound Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              rows="3"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.description}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.country && formik.errors.country ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="Egypt">Egypt</option>
              <option value="UAE">UAE</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
            </select>
            {formik.touched.country && formik.errors.country && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.country}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            >
              <option value="">Select City</option>
              <option value="Cairo">Cairo</option>
              <option value="Alexandria">Alexandria</option>
              <option value="مدينتي">مدينتي</option>
              <option value="New Cairo">New Cairo</option>
            </select>
            {formik.touched.city && formik.errors.city && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (m²)</label>
            <input
              type="number"
              name="area"
              value={formik.values.area}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.area && formik.errors.area ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
            />
            {formik.touched.area && formik.errors.area && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.area}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input
              type="url"
              name="video_url"
              value={formik.values.video_url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${formik.touched.video_url && formik.errors.video_url ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
              placeholder="https://youtube.com/..."
            />
            {formik.touched.video_url && formik.errors.video_url && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.video_url}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
            <div className="flex">
              <input
                type="url"
                name="google_map_link"
                value={formik.values.google_map_link}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2 rounded-l-lg border ${formik.touched.google_map_link && formik.errors.google_map_link ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
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
            {formik.touched.google_map_link && formik.errors.google_map_link && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.google_map_link}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Developer</label>
            {!newDeveloper ? (
              <div className="flex gap-2">
                <select
                  name="developer_name"
                  value={formik.values.developer_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${formik.touched.developer_name && formik.errors.developer_name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
                >
                  <option value="">Select Developer</option>
                  {developersData && developersData.length > 0 ? (
                    developersData.map((dev, index) => (
                      <option key={index} value={dev.name}>{dev.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Talaat Mostafa Group (TMG) - طلعت مصطفى">Talaat Mostafa Group (TMG) - طلعت مصطفى</option>
                      <option value="Madinaty">Madinaty</option>
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
                  value={formik.values.developer_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-lg border ${formik.touched.developer_name && formik.errors.developer_name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-primary focus:border-transparent`}
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
            {formik.touched.developer_name && formik.errors.developer_name && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.developer_name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Master Plan Image</label>
            <div className={`border-2 border-dashed ${formik.touched.master_plan && formik.errors.master_plan ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4 text-center`}>
              <input
                type="file"
                id="masterPlanImage"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                ref={fileInputRef}
              />
              
              {/* When no file is selected or uploaded */}
              {!selectedFile && !formik.values.master_plan && (
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
              {formik.values.master_plan && (
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
            {formik.touched.master_plan && formik.errors.master_plan && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.master_plan}</div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="gated"
              name="gated"
              checked={formik.values.gated}
              onChange={formik.handleChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="gated" className="ml-2 text-sm font-medium text-gray-700">
              Gated Community
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {formik.isSubmitting ? 'جاري الحفظ...' : 'Save Compound'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompoundModal;