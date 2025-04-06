
"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Globe } from 'lucide-react'
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">AI Efficiency Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link href="" className="hover:text-blue-200 transition-colors">
              Client Dashboard
            </Link>
            <Link href="" className="hover:text-blue-200 transition-colors">
              Job Opportunities
            </Link>
            <Link href="" className="hover:text-blue-200 transition-colors">
              All Properties
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
        
            {/* <LanguageSwitcher /> */}
            <Link href="/dashbord" className="text-white border border-blue-400 px-5 py-1.5 rounded-full hover:border-blue-200 hover:text-blue-200 transition-all duration-300">
              Signup
            </Link>
            <Link href="/dashbord" className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300">
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-blue-700">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="hover:text-blue-200 transition-colors py-2">
                Home
              </Link>
              <Link href="" className="hover:text-blue-200 transition-colors py-2">
                Client Dashboard
              </Link>
              <Link href="" className="hover:text-blue-200 transition-colors py-2">
                Job Opportunities
              </Link>
              <Link href="" className="hover:text-blue-200 transition-colors py-2">
                All Properties
              </Link>
              <div className="flex items-center space-x-3 pt-2">
                {/* <button className="p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <Globe size={20} />
                </button> */}
                <Link href="/dashbord" className="text-white border border-blue-400 px-5 py-1.5 rounded-full hover:border-blue-200 hover:text-blue-200 transition-all duration-300">
                  Signup
                </Link>
                <Link href="/dashbord" className="text-yellow-400 border border-yellow-400 px-5 py-1.5 rounded-full hover:border-yellow-200 hover:text-yellow-200 transition-all duration-300">
                  Sign In
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
