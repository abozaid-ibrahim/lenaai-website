import Footer from '@/components/web/common/footer';
import Header from '@/components/web/common/Header';
import React from 'react';

const Layout = ({ children }) => {
  return (
    
      <>
      <Header/>
      {children}
      <Footer/>
      </>
  );
};

export default Layout;
