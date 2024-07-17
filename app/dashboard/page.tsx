'use client'

import { useState, useEffect } from 'react';

// Define the type for a lead
interface Lead {
  name: string;
  email: string;
  company: string;
  source: string;
  createdAt: string;
}

// LeadsTable component
function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All leads</h1>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
          onClick={() => window.location.reload()}
        >
          New lead
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or company"
          className="w-full p-3 rounded-md bg-gray-100"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Company</th>
            <th className="text-left p-3">Source</th>
            <th className="text-left p-3">Created at</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{lead.name}</td>
              <td className="p-3">{lead.email}</td>
              <td className="p-3">{lead.company}</td>
              <td className="p-3">{lead.source}</td>
              <td className="p-3">{lead.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main Dashboard component
export default function Dashboard() {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLeads, setShowLeads] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  const handleGatherInfo = () => {
    setIsLoading(true);
    // Simulating progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setShowLeads(true);
      }
    }, 500);
  };

  useEffect(() => {
    // Simulating leads data fetch
    if (showLeads) {
      const sampleLeads: Lead[] = [
        { name: "Sarah Smith", email: "sarah.smith@gmail.com", company: "Acme Co", source: "Manual", createdAt: "2 days ago" },
        { name: "John Doe", email: "john.doe@gmail.com", company: "Initech", source: "Manual", createdAt: "3 days ago" },
        { name: "Jane Johnson", email: "jane.johnson@gmail.com", company: "Umbrella Corp", source: "Manual", createdAt: "4 days ago" },
        { name: "Mike Miller", email: "mike.miller@gmail.com", company: "Wayne Enterprises", source: "Manual", createdAt: "5 days ago" },
        { name: "Emily Davis", email: "emily.davis@gmail.com", company: "Stark Industries", source: "Manual", createdAt: "6 days ago" },
      ];
      setLeads(sampleLeads);
    }
  }, [showLeads]);

  if (showLeads) {
    return <LeadsTable leads={leads} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <div className="max-w-2xl w-full px-5 py-8 space-y-7">
          <h2 className="text-3xl font-bold mb-4 text-center">Importing data</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
          </div>
          <p className="text-center">{Math.round(progress / 100 * 12000)} rows imported</p>
          <p className="text-center">Please wait while we import your data. This may take a few minutes.</p>
        </div>
      ) : (
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

            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded flex items-center justify-center transition-colors"
              onClick={handleGatherInfo}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Gather Contact Information
            </button>
          </div>
        </div>
      )}
    </div>
  );
}