import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
    try {
        const { query, location, platform, contactType, site } = await request.json();
        
        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const searchQuery = `"${site}" "${query}" "${location}" "${platform}"`;
        const numPages = 20;
        const contacts = new Set<string>();

        const fetchPromises = Array.from({ length: numPages }, (_, page) => {
            const start = page * 5;
            const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&start=${start}`;
            return fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            });
        });

        const htmlResults = await Promise.all(fetchPromises);

        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const phoneRegex = new RegExp(`\\${site}[0-9]{10}`, 'g');

        htmlResults.forEach(html => {
            const $ = cheerio.load(html);
            const bodyText = $('body').text();

            if (contactType === 'email') {
                bodyText.match(emailRegex)?.forEach(email => contacts.add(email));
            } else if (contactType === 'phone') {
                bodyText.match(phoneRegex)?.forEach(phone => contacts.add(phone));
            }
        });

        console.log({contacts: Array.from(contacts)});

        return NextResponse.json({ contacts: Array.from(contacts) });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}