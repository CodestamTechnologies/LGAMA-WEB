import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { email, smtpHost, smtpPort, smtpUser, smtpPassword, htmlTemplate } = await request.json();

        if (!email || !smtpHost || !smtpPort || !smtpUser || !smtpPassword || !htmlTemplate) {
            return NextResponse.json({ error: 'All parameters are required' }, { status: 400 });
        }

        // Create a nodemailer transporter using the provided SMTP credentials
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort, 10),
            secure: smtpPort === '465', // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
        });

        // Define the email options
        const mailOptions = {
            from: smtpUser,
            to: email,
            subject: 'Your Custom Subject Here',
            html: htmlTemplate,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

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
//     "htmlTemplate": "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" /><title>Email</title></head><body><h1>Hello, World!</h1><p>This is a test email.</p></body></html>"
//   }
  