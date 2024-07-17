'use client'

import { useState } from 'react';

export default function Home() {
  const [location, setLocation] = useState('');

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-2xl w-full px-5 py-8 space-y-7">
        <h2 className="text-3xl font-bold mb-4 text-center">Discover New Leads</h2>
        <p className="mb-6 text-center">Begin by entering the keywords or business category you're targeting.</p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="platform" className="block mb-2 text-sm font-medium">
              Select a Platform: Choose a preferred social network or website for your search
            </label>
            <select
              id="platform"
              className="w-full p-2.5 rounded bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a platform</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label htmlFor="search" className="block mb-2 text-sm font-medium">
              Define Your Search: Enter the keywords or business category you're interested in.
            </label>
            <input
              type="text"
              id="search"
              className="w-full p-2.5 rounded bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter keywords or business category"
            />
          </div>

          <div>
            <label htmlFor="location" className="block mb-2 text-sm font-medium">
              Location (Optional): Specify a location for your search
            </label>
            <input
              type="text"
              id="location"
              className="w-full p-2.5 rounded bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Gather Contact Information
          </button>
        </div>
      </div>
    </div>
  );
}