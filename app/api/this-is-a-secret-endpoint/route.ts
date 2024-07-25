import { NextRequest, NextResponse } from 'next/server';
import nodemailer, { Transporter } from 'nodemailer';
import { buildSearchUrl, fetchSearchResults, extractContacts } from '../maildump/route';
import { connectToDB } from '@/lib/utils/dbConnect';
import UnsentEmail, { IUnsentEmail } from '@/lib/models/UnsentEmail';
import SentEmail, { ISentEmail } from '@/lib/models/SentEmail';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

interface RequestBody {
    platform: string;
    contactType: string;
    site: string;
    emailSubject: string;
    htmlTemplate: string;
}

interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const queries: string[] = [
    // ... (keep the existing array)
];

const locations: string[] = [
    // ... (keep the existing array)
];

const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT!, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmail = async (email: string, subject: string, htmlTemplate: string): Promise<void> => {
    const mailOptions: EmailOptions = {
        from: process.env.SMTP_USER!,
        to: email,
        subject: subject,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        await connectToDB();

        const { platform, contactType, site, emailSubject, htmlTemplate }: RequestBody = await request.json();

        if (!emailSubject || !htmlTemplate) {
            return NextResponse.json({ error: 'emailSubject and htmlTemplate are required' }, { status: 400 });
        }

        const query: string = queries[Math.floor(Math.random() * queries.length)];
        const location: string = locations[Math.floor(Math.random() * locations.length)];

        const unsentEmails = await UnsentEmail.find().limit(5).lean();

        if (unsentEmails.length > 0) {
            const sentEmails: string[] = [];
            const emailsToSend = [];
            const sentEmailsCheck = await SentEmail.find({ email: { $in: unsentEmails.map(ue => ue.email) } }, 'email').lean();
            const sentEmailSet: Set<string> = new Set(sentEmailsCheck.map(se => se.email));

            for (const unsentEmail of unsentEmails) {
                if (!sentEmailSet.has(unsentEmail.email)) {
                    emailsToSend.push(unsentEmail);
                }
            }

            const sendPromises: Promise<void>[] = emailsToSend.map(async (emailToSend) => {
                await UnsentEmail.deleteOne({ _id: emailToSend._id });
                await sendEmail(emailToSend.email, emailSubject, htmlTemplate);
                const sentEmail: ISentEmail = new SentEmail({
                    ...emailToSend,
                    sentAt: new Date()
                });
                await sentEmail.save();
                sentEmails.push(emailToSend.email);
            });

            await Promise.all(sendPromises);

            return NextResponse.json({ message: `Emails sent to ${sentEmails.length} contacts`, emails: sentEmails });
        } else {
            const numPages: number = 10;
            const fetchPromises: Promise<string>[] = Array.from({ length: numPages }, (_, page) => {
                const url: string = buildSearchUrl(query, location, platform, site, page);
                return fetchSearchResults(url);
            });

            const htmlResults: string[] = await Promise.all(fetchPromises);
            const contacts: Set<string> = new Set<string>();

            htmlResults.forEach(html => {
                const extractedContacts = extractContacts(html, contactType, site);
                extractedContacts.forEach(contact => contacts.add(contact));
            });

            const contactsArray: string[] = Array.from(contacts);

            const sentEmails = await SentEmail.find({ email: { $in: contactsArray } }, 'email').lean();
            const sentEmailSet: Set<string> = new Set(sentEmails.map(se => se.email));
            const newContacts: string[] = contactsArray.filter(email => !sentEmailSet.has(email));

            const unsentEmails: Partial<IUnsentEmail>[] = newContacts.map(email => ({
                query,
                location,
                platform,
                contactType,
                site,
                email
            }));

            if (unsentEmails.length > 0) {
                await UnsentEmail.insertMany(unsentEmails);
            }

            return NextResponse.json({ contacts: newContacts });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
    }
}
