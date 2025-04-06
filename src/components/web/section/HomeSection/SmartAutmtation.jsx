import React from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import smart from "../../../../../public/images/Image 84.png"

const SmartAutmtation = () => {
  return (
    <section className="py-16 px-4 max-w-[95%] mx-auto">
      <div className="bg-white  overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Content Side */}
          <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Smart Automation</h2>
            
            <ul className="space-y-6 mb-8">
              <li className="flex items-start">
                <div className="bg-primary text-white rounded-full p-1 mr-3 mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-700 text-lg">
                  Chatbot has access to your crm and reply 24/7 to your clients.
                </p>
              </li>
              
              <li className="flex items-start">
                <div className="bg-primary text-white rounded-full p-1 mr-3 mt-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-700 text-lg">
                  Automate replying with ai to the business whatsapp number.
                </p>
              </li>
            </ul>
            
            <button className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg inline-flex items-center transition-all duration-300 self-start">
              Try Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
          
          {/* Image Side */}
          <div className="lg:w-1/2   relative min-h-[300px] ">
            <Image 
              src={smart} 
              alt="Smart Automation - AI conference room with people" 
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SmartAutmtation
