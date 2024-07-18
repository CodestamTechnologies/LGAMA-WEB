import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
    try {
        const { query, location, platform, site } = await request.json();
        
        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }


        const searchQuery = `"${site}" "${query}" "${location}" "${platform}"`;
        const numPages = 20;
        const emails = new Set<string>();

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

        htmlResults.forEach(html => {
            const $ = cheerio.load(html);
            $('body').text().match(/[a-zA-Z0-9._%+-]+@gmail\.com/g)?.forEach(email => emails.add(email));
        });

        console.log({emails: Array.from(emails)});

        return NextResponse.json({ emails: Array.from(emails) });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}