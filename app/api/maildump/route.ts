import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Function to build the search URL
export function buildSearchUrl(query: string, location: string, platform: string, site: string, page: number): string {
    const start = page * 5;
    const searchQuery = `"${site}" "${query}" "${location}" "${platform}"`;
    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&start=${start}`;
}

// Function to fetch search results
export async function fetchSearchResults(url: string): Promise<string> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
}

// Function to extract contacts from HTML
export function extractContacts(html: string, contactType: string, site: string): Set<string> {
    const contacts = new Set<string>();
    const $ = cheerio.load(html);
    const bodyText = $('body').text();

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = new RegExp(`\\${site}[0-9]{4,13}`, 'g');

    if (contactType === 'email') {
        bodyText.match(emailRegex)?.forEach(email => contacts.add(email));
    } else if (contactType === 'phone') {
        bodyText.match(phoneRegex)?.forEach(phone => contacts.add(phone));
    }

    return contacts;
}

export async function POST(request: NextRequest) {
    try {
        const { query, location, platform, contactType, site } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const numPages = 20;
        const fetchPromises = Array.from({ length: numPages }, (_, page) => {
            const url = buildSearchUrl(query, location, platform, site, page);
            return fetchSearchResults(url);
        });

        const htmlResults = await Promise.all(fetchPromises);
        const contacts = new Set<string>();

        htmlResults.forEach(html => {
            const extractedContacts = extractContacts(html, contactType, site);
            extractedContacts.forEach(contact => contacts.add(contact));
        });

        console.log({ contacts: Array.from(contacts) });

        return NextResponse.json({ contacts: Array.from(contacts) });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}

// API Query
// {
//     "query": "marketing agencies",
//     "location": "New York",
//     "platform": "LinkedIn",
//     "contactType": "email",
//     "site": "gmail.com"
// }
