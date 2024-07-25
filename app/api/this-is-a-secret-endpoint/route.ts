import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { buildSearchUrl, fetchSearchResults, extractContacts } from '../maildump/route';
import { connectToDB } from '@/lib/utils/dbConnect';
import UnsentEmail from '@/lib/models/UnsentEmail';
import SentEmail from '@/lib/models/SentEmail';


export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = 'force-dynamic';


const queries = [
    "Realtors", "Real estate agents", "Real estate brokers", "Real estate agencies",
    "Real estate firms", "Property management companies", "Real estate investors",
    "Doctors", "Dentists", "Chiropractors", "Therapists", "Hospitals", "Clinics",
    "Medical practices", "Restaurants", "Retail stores", "Salons", "Spas", "Fitness centers",
    "Law firms", "Accounting firms", "Online retailers", "E-commerce businesses", "E-commerce startups",
    "E-commerce platforms", "Online marketplaces", "Direct-to-consumer brands", "Marketing agencies",
    "Advertising agencies", "Digital marketing agencies", "Social media marketing agencies",
    "Content marketing agencies", "SEO agencies", "Nonprofit organizations", "Charitable organizations",
    "Professional associations", "Trade associations", "Industry organizations", "Community organizations",
    "Hotels", "Resorts", "Travel agencies", "Tour operators", "Vacation rental companies", "Cruise lines",
    "Schools", "Colleges", "Universities", "Educational institutions", "Training centers", "Online education platforms"
];

const locations = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio",
    "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
    "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville",
    "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville", "Baltimore"
];

const sendEmail = async (email: string, subject: string, htmlTemplate: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT!, 10),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        html: htmlTemplate,
    };

    return transporter.sendMail(mailOptions);
};

export async function POST(request: NextRequest) {
    try {
        await connectToDB();

        const { platform, contactType, site, emailSubject, htmlTemplate } = await request.json();

        if (!emailSubject || !htmlTemplate) {
            return NextResponse.json({ error: 'emailSubject and htmlTemplate are required' }, { status: 400 });
        }

        const query = queries[Math.floor(Math.random() * queries.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];

        // Check for existing unsent emails
        let unsentEmails = await UnsentEmail.find().limit(5);
        const sentEmails = [];

        while (unsentEmails.length > 0 && sentEmails.length < 5) {
            for (const unsentEmail of unsentEmails) {
                try {
                    const email = unsentEmail.email;
                    await UnsentEmail.deleteOne({ _id: unsentEmail._id });

                    await sendEmail(email, emailSubject, htmlTemplate);

                    const sentEmail = new SentEmail({
                        query: unsentEmail.query,
                        location: unsentEmail.location,
                        platform: unsentEmail.platform,
                        contactType: unsentEmail.contactType,
                        site: unsentEmail.site,
                        email,
                        sentAt: new Date()
                    });

                    await sentEmail.save();
                    sentEmails.push(email);

                    if (sentEmails.length === 5) break;
                } catch (sendError) {
                    console.error('Error sending email:', sendError);
                }
            }

            // If less than 5 emails were sent, check for more unsent emails
            if (sentEmails.length < 5) {
                unsentEmails = await UnsentEmail.find().limit(5 - sentEmails.length);
            }
        }

        // If still less than 5 emails were sent, collect new emails
        if (sentEmails.length < 5) {
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

            const contactsArray = Array.from(contacts);
            const newUnsentEmails = contactsArray.map(email => ({
                query,
                location,
                platform,
                contactType,
                site,
                email
            }));

            // Check if new contacts are already in SentEmail
            const existingSentEmails = await SentEmail.find({
                email: { $in: contactsArray }
            }).distinct('email');

            const filteredNewUnsentEmails = newUnsentEmails.filter(emailObj => !existingSentEmails.includes(emailObj.email));

            await UnsentEmail.insertMany(filteredNewUnsentEmails);

            const emailsToSend = filteredNewUnsentEmails.slice(0, 5 - sentEmails.length);
            for (const unsentEmail of emailsToSend) {
                try {
                    const email = unsentEmail.email;
                    await UnsentEmail.deleteOne({ email });

                    await sendEmail(email, emailSubject, htmlTemplate);

                    const sentEmail = new SentEmail({
                        query: unsentEmail.query,
                        location: unsentEmail.location,
                        platform: unsentEmail.platform,
                        contactType: unsentEmail.contactType,
                        site: unsentEmail.site,
                        email,
                        sentAt: new Date()
                    });

                    await sentEmail.save();
                    sentEmails.push(email);
                } catch (sendError) {
                    console.error('Error sending email:', sendError);
                }
            }

            return NextResponse.json({ contacts: contactsArray, sentEmails });
        }

        return NextResponse.json({ message: 'Emails sent to unsent contacts', emails: sentEmails });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}
