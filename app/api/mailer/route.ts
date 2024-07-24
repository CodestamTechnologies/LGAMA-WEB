import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Function to validate the input
function validateInput(email: string, smtpHost: string, smtpPort: string, smtpUser: string, smtpPassword: string, subject: string, htmlTemplate: string): boolean {
    return !!email && !!smtpHost && !!smtpPort && !!smtpUser && !!smtpPassword && !!subject && !!htmlTemplate;
}

// Function to create the Nodemailer transporter
function createTransporter(smtpHost: string, smtpPort: string, smtpUser: string, smtpPassword: string) {
    return nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: smtpPort === '465', // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPassword,
        },
    });
}

// Function to send the email
async function sendEmail(transporter: nodemailer.Transporter, email: string, smtpUser: string, subject: string, htmlTemplate: string) {
    const mailOptions = {
        from: smtpUser,
        to: email,
        subject: subject,
        html: htmlTemplate,
    };

    return transporter.sendMail(mailOptions);
}

export async function POST(request: NextRequest) {
    try {
        const { email, smtpHost, smtpPort, smtpUser, smtpPassword, subject, htmlTemplate } = await request.json();

        if (!validateInput(email, smtpHost, smtpPort, smtpUser, smtpPassword, subject, htmlTemplate)) {
            return NextResponse.json({ error: 'All parameters are required' }, { status: 400 });
        }

        const transporter = createTransporter(smtpHost, smtpPort, smtpUser, smtpPassword);
        const info = await sendEmail(transporter, email, smtpUser, subject, htmlTemplate);

        console.log('Email sent:', info.response);

        return NextResponse.json({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'An error occurred while sending the email' }, { status: 500 });
    }
}

// API Query
// {
//     "email": "recipient@example.com",
//     "smtpHost": "smtp.your-smtp-host.com",
//     "smtpPort": "587",
//     "smtpUser": "your-smtp-user@example.com",
//     "smtpPassword": "your-smtp-password",
//     "subject": "Your email subject",
//     "htmlTemplate": "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Email</title></head><body><h1>Hello, World!</h1><p>This is a test email.</p><span className=\"text-sm\">A product of <a href=\"https://codestam.com\"><b><i>Codestam</i></b></a></span></body></html>"
// }
