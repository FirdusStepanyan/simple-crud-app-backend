import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error('SMTP verification failed:', err);
    } else {
        console.log('SMTP ready:', success);
    }
});

export const sendVerificationEmail = async (email: string, code: number) => {
    console.log({
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    });

    const mailOptions = {
        from: `"Firdus Test Nodejs Notifications" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        text: `Welcome! Your verification code is: ${code}`,
        html: `<p>Welcome! Your verification code is: <strong>${code}</strong></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

};