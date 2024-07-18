'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Lead {
  name: string;
  email: string;
  company: string;
  source: string;
}

function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200">Name</th>
            <th className="py-2 px-4 bg-gray-200">Email</th>
            <th className="py-2 px-4 bg-gray-200">Company</th>
            <th className="py-2 px-4 bg-gray-200">Source</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{lead.name}</td>
              <td className="py-2 px-4 border-b">{lead.email}</td>
              <td className="py-2 px-4 border-b">{lead.company}</td>
              <td className="py-2 px-4 border-b">{lead.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [site, setSite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLeads, setShowLeads] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [scrapingProgress, setScrapingProgress] = useState(0);

  const handleGatherInfo = async () => {
    setIsLoading(true);
    setProgress(0);
    setScrapingProgress(0);

    try {
      const response = await axios.post('/api/scrape', {
        query: search,
        location: location,
        platform: platform,
        site: site
      });

      const emails = response.data.emails;
      const newLeads: Lead[] = emails.map((email: string, index: number) => ({
        name: `Lead ${index + 1}`,
        email: email,
        company: 'Unknown',
        source: 'Internet',
      }));

      setLeads(newLeads);
      setShowLeads(true);
    } catch (error) {
      console.error('Error gathering information:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  // Simulating progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setScrapingProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (showLeads) {
    return <LeadsTable leads={leads} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <div className="max-w-2xl w-full px-5 py-8 space-y-7">
          <h2 className="text-3xl font-bold mb-4 text-center">Scraping data</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${scrapingProgress}%`}}></div>
          </div>
          <p className="text-center">{scrapingProgress}% complete</p>
          <p className="text-center">Please wait while we gather contact information. This may take a few minutes.</p>
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
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="">Select a platform</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>

            <div>
              <label htmlFor="site" className="block mb-2 text-sm font-medium">
                Select Email Domain: Choose the email domain to search for
              </label>
              <select
                id="site"
                className="w-full p-2.5 rounded bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                value={site}
                onChange={(e) => setSite(e.target.value)}
              >
                <option value="">Select an email domain</option>
                <option value="gmail.com">gmail.com</option>
                <option value="hotmail.com">hotmail.com</option>
                <option value="yahoo.com">yahoo.com</option>
                <option value="outlook.com">outlook.com</option>
                <option value="aol.com">aol.com</option>
                <option value="icloud.com">icloud.com</option>
                <option value="mail.com">mail.com</option>
                <option value="zoho.com">zoho.com</option>
                <option value="protonmail.com">protonmail.com</option>
                <option value="gmx.com">gmx.com</option>
                <option value="yandex.com">yandex.com</option>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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