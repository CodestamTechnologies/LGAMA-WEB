import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { buildSearchUrl, fetchSearchResults, extractContacts } from '../maildump/route';
import { connectToDB } from '@/lib/utils/dbConnect';
import UnsentEmail from '@/lib/models/UnsentEmail';
import SentEmail from '@/lib/models/SentEmail';

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

        const { query, location, platform, contactType, site, emailSubject, htmlTemplate } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // Check for existing unsent emails
        const unsentEmail = await UnsentEmail.findOne();

        if (unsentEmail) {
            // Send the first unsent email
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

            return NextResponse.json({ message: 'Email sent to the first unsent contact', email });
        } else {
            // No unsent emails, collect new emails
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
            const unsentEmails = contactsArray.map(email => ({
                query,
                location,
                platform,
                contactType,
                site,
                email
            }));

            await UnsentEmail.insertMany(unsentEmails);

            console.log({ contacts: contactsArray });

            return NextResponse.json({ contacts: contactsArray });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}
