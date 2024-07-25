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

interface EmailDetails {
    _id?: any;
    query: string;
    location: string;
    platform: string;
    contactType: string;
    site: string;
    email: string;
}

interface RequestBody {
    platform: string;
    contactType: string;
    site: string;
    emailSubject: string;
    htmlTemplate: string;
}

const sendEmail = async (email: string, subject: string, htmlTemplate: string): Promise<void> => {
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

    await transporter.sendMail(mailOptions);
};

const processEmailSending = async (unsentEmails: EmailDetails[], emailSubject: string, htmlTemplate: string, sentEmails: string[]): Promise<void> => {
    await Promise.all(unsentEmails.map(async (unsentEmail) => {
        try {
            const email = unsentEmail.email;
            await UnsentEmail.deleteOne({ _id: unsentEmail._id });
            await sendEmail(email, emailSubject, htmlTemplate);

            const sentEmail = new SentEmail({
                ...unsentEmail,
                sentAt: new Date(),
            });

            await sentEmail.save();
            sentEmails.push(email);
        } catch (sendError) {
            console.error('Error sending email:', sendError);
        }
    }));
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectToDB();
        const { platform, contactType, site, emailSubject, htmlTemplate }: RequestBody = await request.json();

        if (!emailSubject || !htmlTemplate) {
            return NextResponse.json({ error: 'emailSubject and htmlTemplate are required' }, { status: 400 });
        }

        const query = queries[Math.floor(Math.random() * queries.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];

        let unsentEmails: EmailDetails[] = await UnsentEmail.find().limit(5);
        const sentEmails: string[] = [];

        await processEmailSending(unsentEmails, emailSubject, htmlTemplate, sentEmails);

        if (sentEmails.length < 5) {
            const numPages = 20;
            const fetchPromises = Array.from({ length: numPages }, (_, page) => fetchSearchResults(buildSearchUrl(query, location, platform, site, page)));
            const htmlResults = await Promise.all(fetchPromises);

            const contacts = new Set<string>();
            htmlResults.forEach(html => extractContacts(html, contactType, site).forEach(contact => contacts.add(contact)));

            const contactsArray = Array.from(contacts);
            const newUnsentEmails: EmailDetails[] = contactsArray.map(email => ({
                query, location, platform, contactType, site, email
            }));

            const existingSentEmails: string[] = await SentEmail.find({ email: { $in: contactsArray } }).distinct('email');
            const filteredNewUnsentEmails = newUnsentEmails.filter(emailObj => !existingSentEmails.includes(emailObj.email));

            await UnsentEmail.insertMany(filteredNewUnsentEmails);

            const emailsToSend = filteredNewUnsentEmails.slice(0, 5 - sentEmails.length);
            await processEmailSending(emailsToSend, emailSubject, htmlTemplate, sentEmails);

            return NextResponse.json({ contacts: contactsArray, sentEmails });
        }

        return NextResponse.json({ message: 'Emails sent to unsent contacts', emails: sentEmails });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}
