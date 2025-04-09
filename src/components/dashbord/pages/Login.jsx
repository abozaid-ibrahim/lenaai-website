"use client"
import React from 'react';
import Link from 'next/link';
import { useLoginForm } from '../hooks/useLoginForm';

const Login = () => {
  const { formik, loading } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Lena Ai</h1>
            <p className="text-blue-100 mt-2">Sign in to your account</p>
          </div>
          
          {/* Form */}
          <div className="p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...formik.getFieldProps('username')}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formik.touched.username && formik.errors.username 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                  placeholder="Enter your username"
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...formik.getFieldProps('password')}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formik.touched.password && formik.errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-primary'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition`}
                  placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className="w-full flex cursor-pointer justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
            
            <div className="mt-6">
              <Link href="/" className="block text-center py-3 px-4 rounded-lg border-2 border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200">
                Back to Home
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
            &copy; 2025 Lena Ai. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
