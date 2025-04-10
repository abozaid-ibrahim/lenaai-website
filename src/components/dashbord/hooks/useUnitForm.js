"use client";
import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import {
  addUnit,
  deleteImage,
  uploadImages,
} from "@/components/services/serviceFetching";
import Cookies from "js-cookie";
// import { uploadImages, deleteImage, addUnit } from '@/components/services/serviceFetching';
import propertyEnums from "../data/propertyEnums.json";

export const useUnitForm = (onClose, onSave) => {
  const router = useRouter();

  // Get client_id from cookies
  const clientId = Cookies.get("client_id") || "DREAM_HOMES";

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    unitTitle: Yup.string().required("Unit title is required"),
    compound: Yup.string().required("Compound is required"),
    buildingType: Yup.string().required("Building type is required"),
    purpose: Yup.string().required("Purpose is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    district: Yup.string(),
    view: Yup.string().required("View is required"),
    totalPrice: Yup.number()
      .positive("Price must be greater than zero")
      .required("Total price is required"),
    downPayment: Yup.number()
      .positive("Down payment must be greater than zero")
      .required("Down payment is required"),
    deliveryDate: Yup.string().required("Delivery date is required"),
    roomsCount: Yup.number()
      .positive("Rooms count must be greater than zero")
      .required("Rooms count is required"),
    bathroomCount: Yup.number()
      .positive("Bathroom count must be greater than zero")
      .required("Bathroom count is required"),
    floor: Yup.number().required("Floor is required"),
    landArea: Yup.number()
      .positive("Land area must be greater than zero")
      .required("Land area is required"),
    gardenSize: Yup.number().required("Garden size is required"),
    garageArea: Yup.number().required("Garage area is required"),
    finishing: Yup.string().required("Finishing type is required"),
    developer: Yup.string().required("Developer is required"),
    dataSource: Yup.string().required("Data source is required"),
    paymentPlans: Yup.string(),
  });

  const [isAddCompoundModalOpen, setIsAddCompoundModalOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isPaymentPlanPopupOpen, setIsPaymentPlanPopupOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Get default values from the JSON file
  const defaultBuildingType = propertyEnums.EnumBuildingType[0] || "apartment";
  const defaultPurpose = propertyEnums.EnumPropertyIntent[0] || "buy";
  const defaultView = propertyEnums.EnumViewType[0] || "lagoon";

  // Initialize formik with default values from the JSON file
  const formik = useFormik({
    initialValues: {
      buildingType: defaultBuildingType.charAt(0).toUpperCase() + defaultBuildingType.slice(1),
      purpose: defaultPurpose.charAt(0).toUpperCase() + defaultPurpose.slice(1),
      compound: "",
      view: defaultView.charAt(0).toUpperCase() + defaultView.slice(1),
      country: "Egypt",
      city: "",
      district: "",
      clientName: clientId,
      clientId: clientId,
      developer: "",
      unitId: uuidv4(),
      unitTitle: "",
      deliveryDate: "",
      bathroomCount: "",
      floor: "",
      roomsCount: "",
      landArea: "",
      gardenSize: "",
      finishing: "",
      dataSource: "website", // Set default value for dataSource
      downPayment: "",
      totalPrice: "",
      paymentPlans: "",
      garageArea: "",
      images: [],
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
        formik.setFieldValue("unitId", uuidv4());
        formik.setFieldValue("buildingType", defaultBuildingType.charAt(0).toUpperCase() + defaultBuildingType.slice(1));
        formik.setFieldValue("purpose", defaultPurpose.charAt(0).toUpperCase() + defaultPurpose.slice(1));
        formik.setFieldValue("view", defaultView.charAt(0).toUpperCase() + defaultView.slice(1));
        formik.setFieldValue("country", "Egypt");
        formik.setFieldValue("district", "");
        formik.setFieldValue("clientId", "DREAM_HOMES");
        formik.setFieldValue("images", []);

        onClose();
      } catch (error) {
        console.error("Error adding unit:", error);
        toast.error(error.message || "فشل في إضافة الوحدة");
      }
    },
  });

  // Generate new UUID when modal opens
  useEffect(() => {
    formik.setFieldValue("unitId", uuidv4());
  }, []);

  // Reset file input to allow reselecting the same file
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelection = (files, replace = false) => {
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

      // Update formik values
      formik.setFieldValue("images", [...formik.values.images, ...imagesArray]);

      toast.success(`Image uploaded successfully`);
      setSelectedFiles([]);
      resetFileInput();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        `Failed to upload image: ${error.message || "Unknown error"}`
      );
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

      // Remove from formik state after successful API deletion
      const updatedImages = [...formik.values.images];
      updatedImages.splice(index, 1);
      formik.setFieldValue("images", updatedImages);

      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(
        `Failed to delete image: ${error.message || "Unknown error"}`
      );
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
      "paymentPlans",
      currentPlans ? `${currentPlans}, ${planText}` : planText
    );
  };

  // Update the handleRemovePaymentPlan function to work with string
  const handleRemovePaymentPlan = (index) => {
    const plansArray = formik.values.paymentPlans.split(", ");
    plansArray.splice(index, 1);
    formik.setFieldValue("paymentPlans", plansArray.join(", "));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCompoundSave = (compoundData) => {
    // Set the newly created compound name to the unit's compound field
    formik.setFieldValue(
      "compound",
      compoundData.name || compoundData.compoundName
    );
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
    handleCompoundSave,
  };
};
