'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Lead {
  name: string;
  email: string;
  source: string;
  createdAt: string;
}

function formatDate(): string {
  const now = new Date();
  return now.toLocaleString();
}

function LeadsTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-48 py-8 sm:py-12 md:py-16">
      <div className="flex sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">All leads</h1>
        <a
          className="group bg-gray-900 text-white px-5 sm:px-7 py-2 sm:py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition text-sm sm:text-base"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
        >
          Generate more{" "}
        </a>
      </div>
      <div className="mb-6"></div>
      <div className="overflow-auto bg-white bg-opacity-0 rounded-lg shadow max-h-[70vh]">
        <div className="min-w-max">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky bg-gray-50 top-0 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No.</th>
                <th className="sticky bg-gray-50 top-0 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="sticky bg-gray-50 top-0 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="sticky bg-gray-50 top-0 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created at</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead, index) => (
                <tr key={index}>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-950">{lead.name}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-950">{lead.email}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-950">{lead.source}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-950">{lead.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [contactType, setContactType] = useState('email');
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
      const response = await axios.post('/api/maildump', {
        query: search,
        location: location,
        platform: platform,
        contactType: contactType,
        site: site
      });

      const contacts = response.data.contacts;
      const newLeads: Lead[] = contacts.map((contact: string, index: number) => ({
        name: `Lead ${index + 1}`,
        email: contact,
        source: 'Internet',
        createdAt: formatDate(),
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
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8">
      {isLoading ? (
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Scraping data</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${scrapingProgress}%`}}></div>
          </div>
          <p className="text-center">{scrapingProgress}% complete</p>
          <p className="text-center text-sm sm:text-base">Please wait while we gather contact information. This may take a few minutes.</p>
        </div>
      ) : (
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Discover New Leads</h2>
          <p className="mb-6 text-center text-sm sm:text-base">Begin by entering the keywords or business category you're targeting.</p>
          
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
              <label htmlFor="contactType" className="block mb-2 text-sm font-medium">
                Select Contact Type: Choose between email or phone number
              </label>
              <select
                id="contactType"
                className="w-full p-2.5 rounded bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
              >
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
              </select>
            </div>

            {contactType === 'email' ? (
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
            ) : (
              <div>
                <label htmlFor="site" className="block mb-2 text-sm font-medium">
                  Select Country Code: Choose the country code for phone numbers
                </label>
                <select
                  id="site"
                  className="w-full p-2.5 rounded bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                >
                  <option value="">Select a country code</option>
                  <option value="+1">+1 (USA/Canada)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+91">+91 (India)</option>
                  <option value="+61">+61 (Australia)</option>
                  <option value="+33">+33 (France)</option>
                  <option value="+49">+49 (Germany)</option>
                  <option value="+81">+81 (Japan)</option>
                  <option value="+86">+86 (China)</option>
                </select>
              </div>
            )}

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