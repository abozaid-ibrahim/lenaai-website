"use client"
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/components/services/serviceFetching';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

export const useLoginForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      
      try {
        // Create FormData object
        const formData = new FormData();
        
        // Add username and password directly to FormData
        formData.append('username', values.username);
        formData.append('password', values.password);
        
        // Call loginUser with FormData
        const response = await loginUser(formData);
        console.log(response);
        
        // Store access_token and client_id in cookies
        if (response.access_token) {
          Cookies.set('access_token', response.access_token, { expires: 7 }); // Expires in 7 days
        }
        
        if (response.client_id) {
          Cookies.set('client_id', response.client_id, { expires: 7 }); // Expires in 7 days
        }
        
        // Handle successful login
        toast.success('Login successful');
        
        // Redirect to dashboard
        window.location.href = '/dashbord';
      } catch (error) {
        console.error('Login failed:', error);
        if (error.message === "Request failed with status code 401" ) {
          toast.error('Invalid username or password');
        } else {
          toast.error(error.message || 'Login failed');
        }
        
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