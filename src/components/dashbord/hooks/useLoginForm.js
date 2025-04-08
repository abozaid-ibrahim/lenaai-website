"use client"
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      
      try {
        // Add your authentication logic here
        console.log('Login attempt with:', values);
        
        // Simulate API call
        // await new Promise(resolve => setTimeout(resolve, 1000));
        
        // On successful login, redirect to dashboard
        router.push('/dashbord');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setLoading(false);
      }
    }
  });

  return {
    formik,
    loading
  };
};