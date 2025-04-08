"use client"
import { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { addUnit, deleteImage, uploadImages } from '@/components/services/serviceFetching';
// import { uploadImages, deleteImage, addUnit } from '@/components/services/serviceFetching';

export const useUnitForm = (onClose, onSave) => {
  const router = useRouter();
  
  // Define validation schema using Yup
  const validationSchema = Yup.object({
    unitTitle: Yup.string().required('عنوان الوحدة مطلوب'),
    compound: Yup.string().required('اسم المجمع مطلوب'),
    buildingType: Yup.string().required('نوع المبنى مطلوب'),
    purpose: Yup.string().required('الغرض مطلوب'),
    country: Yup.string().required('البلد مطلوب'),
    city: Yup.string().required('المدينة مطلوبة'),
    totalPrice: Yup.number().positive('يجب أن يكون السعر أكبر من صفر').required('السعر الإجمالي مطلوب'),
    roomsCount: Yup.number().positive('يجب أن يكون عدد الغرف أكبر من صفر').required('عدد الغرف مطلوب'),
    bathroomCount: Yup.number().positive('يجب أن يكون عدد الحمامات أكبر من صفر').required('عدد الحمامات مطلوب'),
  });

  const [isAddCompoundModalOpen, setIsAddCompoundModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isPaymentPlanPopupOpen, setIsPaymentPlanPopupOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize formik
  const formik = useFormik({
    initialValues: {
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
      unitTitle: '',
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
    },
    validationSchema,
    onSubmit: async (values) => {
      // التحقق من وجود صور قبل إرسال البيانات
      if (values.images.length === 0) {
        toast.error("يجب عليك رفع الصور على السيرفر أولاً");
        return;
      }
      
      // Convert numeric fields to numbers
      const preparedFormData = {
        ...values,
        updatedAt: new Date().toISOString(), // Add current timestamp
        bathroomCount: values.bathroomCount ? Number(values.bathroomCount) : 0,
        floor: values.floor ? Number(values.floor) : 0,
        roomsCount: values.roomsCount ? Number(values.roomsCount) : 0,
        landArea: values.landArea ? Number(values.landArea) : 0,
        gardenSize: values.gardenSize ? Number(values.gardenSize) : 0,
        downPayment: values.downPayment ? Number(values.downPayment) : 0,
        totalPrice: values.totalPrice ? Number(values.totalPrice) : 0,
        garageArea: values.garageArea ? Number(values.garageArea) : 0,
      };
      
      try {
        // استخدام وظيفة addUnit من serviceFetching
        const response = await addUnit(preparedFormData);
        
        toast.success("unit added successfuly");
        onSave(preparedFormData);
        router.refresh(); // Refresh the data without page reload
        
        // Reset form to initial values with a new UUID
        formik.resetForm();
        formik.setFieldValue('unitId', uuidv4());
        formik.setFieldValue('buildingType', 'Apartment');
        formik.setFieldValue('purpose', 'Buy');
        formik.setFieldValue('view', 'Lagoon');
        formik.setFieldValue('country', 'Egypt');
        formik.setFieldValue('clientId', 'DREAM_HOMES');
        formik.setFieldValue('images', []);
        
        onClose();
      } catch (error) {
        console.error('Error adding unit:', error);
        toast.error(error.message || "فشل في إضافة الوحدة");
      }
    }
  });

  // Generate new UUID when modal opens
  useEffect(() => {
    formik.setFieldValue('unitId', uuidv4());
  }, []);

  // Reset file input to allow reselecting the same file
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelection = (files) => {
    if (!files || files.length === 0) return;
    // Store the selected files without uploading immediately
    setSelectedFiles(prev => [...prev, ...Array.from(files)]);
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploadingImages(true);
    
    try {
      const formDataToUpload = new FormData();
      
      // Add all files with the same key 'file'
      selectedFiles.forEach(file => {
        formDataToUpload.append('file', file);
      });
      
      // استخدام وظيفة uploadImages من serviceFetching
      const uploadedImages = await uploadImages(formDataToUpload);
      
      // التعامل مع الاستجابة
      const imagesArray = Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages];
      
      // Update formik values
      formik.setFieldValue('images', [...formik.values.images, ...imagesArray]);
      
      toast.success(`${imagesArray.length} images uploaded successfully`);
      setSelectedFiles([]);
      resetFileInput();
      
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(`Failed to upload images: ${error.message || "Unknown error"}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = async (index, imageId) => {
    try {
      // استخدام وظيفة deleteImage من serviceFetching
      await deleteImage(imageId);
      
      // Remove from formik state after successful API deletion
      const updatedImages = [...formik.values.images];
      updatedImages.splice(index, 1);
      formik.setFieldValue('images', updatedImages);
      
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error(`Failed to delete image: ${error.message || "Unknown error"}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  };

  // Update the handleAddPaymentPlan function to concatenate strings
  const handleAddPaymentPlan = (planText) => {
    const currentPlans = formik.values.paymentPlans;
    formik.setFieldValue(
      'paymentPlans', 
      currentPlans ? `${currentPlans}, ${planText}` : planText
    );
  };

  // Update the handleRemovePaymentPlan function to work with string
  const handleRemovePaymentPlan = (index) => {
    const plansArray = formik.values.paymentPlans.split(', ');
    plansArray.splice(index, 1);
    formik.setFieldValue('paymentPlans', plansArray.join(', '));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCompoundSave = (compoundData) => {
    // Set the newly created compound name to the unit's compound field
    formik.setFieldValue('compound', compoundData.name || compoundData.compoundName);
  };

  return {
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
    handleCompoundSave
  };
};