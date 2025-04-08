"use client"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImages, deleteImage, addCompound } from '@/components/services/serviceFetching';

// Define validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name of the compound is required'),
  developer_name: Yup.string().required('Developer name is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  area: Yup.number().typeError('Area must be a number').min(0, 'Area cannot be negative'),
});

export const useCompoundForm = (onClose, onSave) => {
  const router = useRouter();
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
      // Check for main layout image
      if (!values.master_plan) {
        toast.error("Main layout image must be uploaded before saving the compound");
        setSubmitting(false);
        return;
      }
      
      try {
        const submissionData = {
          ...values,
          master_plan: values.master_plan ? values.master_plan.url : null
        };
        
        // Use addCompound function from serviceFetching
        const response = await addCompound(submissionData);
        router.refresh();
        
        // Call the onSave function provided by the parent component with the response data
        if (onSave) {
          onSave(response);
        }
        
        // Show success message
        toast.success("Compound added successfully");
        
        // Close the modal
        onClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error(error.message || "Failed to add compound");
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
      
      // Use uploadImages function from serviceFetching
      const uploadedImages = await uploadImages(imageFormData);
      
      const uploadedImage = Array.isArray(uploadedImages) ? uploadedImages[0] : uploadedImages;
      formik.setFieldValue('master_plan', uploadedImage);
      setSelectedFile(null);
      resetFileInput();
      
      toast.success("Master plan uploaded successfully");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeUploadedImage = async () => {
    if (!formik.values.master_plan || !formik.values.master_plan.fileId) return;
    
    setDeletingImage(true);
    try {
      // Use deleteImage function from serviceFetching
      await deleteImage(formik.values.master_plan.fileId);
      
      // Remove from state after successful API deletion
      formik.setFieldValue('master_plan', null);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(error.message || "Failed to delete image");
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