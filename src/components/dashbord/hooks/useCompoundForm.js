"use client"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState, useRef } from 'react';

// تعريف مخطط التحقق باستخدام Yup
const validationSchema = Yup.object({
  name: Yup.string().required('اسم المجمع مطلوب'),
  developer_name: Yup.string().required('اسم المطور مطلوب'),
  city: Yup.string().required('المدينة مطلوبة'),
  country: Yup.string().required('الدولة مطلوبة'),
  area: Yup.number().typeError('المساحة يجب أن تكون رقم').min(0, 'المساحة لا يمكن أن تكون سالبة'),
});

export const useCompoundForm = (onClose, onSave) => {
  const [newDeveloper, setNewDeveloper] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletingImage, setDeletingImage] = useState(false);
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
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
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // التحقق من وجود صورة المخطط الرئيسي
      if (!values.master_plan) {
        toast.error("يجب رفع صورة المخطط الرئيسي قبل حفظ المجمع");
        setSubmitting(false);
        return;
      }
      
      try {
        const submissionData = {
          ...values,
          master_plan: values.master_plan ? values.master_plan.url : null
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
        setSubmitting(false);
      }
    }
  });

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    resetFileInput();
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    
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
      formik.setFieldValue('master_plan', uploadedImage);
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
    if (!formik.values.master_plan || !formik.values.master_plan.fileId) return;
    
    setDeletingImage(true);
    try {
      // Delete from API
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/images/${formik.values.master_plan.fileId}`);
      
      // Remove from state after successful API deletion
      formik.setFieldValue('master_plan', null);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    } finally {
      setDeletingImage(false);
    }
  };

  return {
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
  };
};