import React from 'react'

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Privacy Policy</h1>

      <p className="text-gray-600 mb-6">Effective Date: Fab 1, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
        <p className="text-gray-600">
          Welcome to LenaAI, a technology provider specializing in AI solutions and WhatsApp integration 
          for client communication in Egypt. This Privacy Policy explains how we collect, use, and protect 
          your information when you use our services, Lena Will be your property consultant that buys your dream home
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
        <p className="text-gray-600 mb-2">We may collect the following types of information:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li className="mb-1">Client Contact Information (Name, Email, Phone Number, Business Details)</li>
          <li className="mb-1">WhatsApp Numbers used for AI Integration</li>
          <li className="mb-1">Chat Data (Messages exchanged through our AI system for analysis and improvement)</li>
          <li className="mb-1">Technical Data (Device Information, IP Addresses, Log Data)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
        <p className="text-gray-600 mb-2">We use your information for the following purposes:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li className="mb-1">To set up and manage WhatsApp AI integrations for clients.</li>
          <li className="mb-1">To improve our AI services and ensure seamless client communication.</li>
          <li className="mb-1">To provide customer support and resolve technical issues.</li>
          <li className="mb-1">To comply with legal obligations and security measures.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Data Sharing & Third Parties</h2>
        <p className="text-gray-600 mb-2">We do not sell or rent your data. However, we may share information with:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li className="mb-1">WhatsApp (Meta) as part of the integration process.</li>
          <li className="mb-1">Third-party service providers for hosting, security, and analytics.</li>
          <li className="mb-1">Legal authorities when required by law.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Data Security</h2>
        <p className="text-gray-600">
          We implement industry-standard security measures to protect your data from unauthorized access, 
          disclosure, or misuse. However, no system is 100% secure, so we recommend best practices for 
          clients handling user data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Your Rights & Choices</h2>
        <p className="text-gray-600 mb-2">As a client, you have the right to:</p>
        <ul className="list-disc pl-6 text-gray-600 mb-4">
          <li className="mb-1">Request access to the data we store about you.</li>
          <li className="mb-1">Request correction or deletion of your data.</li>
          <li className="mb-1">Withdraw consent for data usage.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Privacy Policy from time to time. Clients will be notified of significant 
          changes via email or through our website.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Contact Us</h2>
        <p className="text-gray-600 mb-1">
          If you have any questions or concerns regarding this Privacy Policy, please contact us at:
        </p>
        <p className="text-gray-600 mb-1">Email: abozaid@lenaai.net</p>
        <p className="text-gray-600 mb-1">Phone: 01016080323</p>
        <p className="text-gray-600">Company Address: 505 Siac Building, ARCHPLAN Square, New Capital, Cairo, Egypt</p>
      </section>
    </div>
  )
}

export default Privacy
