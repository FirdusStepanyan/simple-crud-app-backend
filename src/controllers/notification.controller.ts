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

export const sendBookmail = async (user: any, booking: any, time_slot: any) => {
  const mailOptions = {
        from: `"Booking Service" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Booking Confirmation - ${booking.booking_code}`,
        text: `Hello ${user.first_name}, your booking is confirmed!
            Booking Code: ${booking.booking_code}
            Slot: ${time_slot.name}
            Number of People: ${booking.number_of_people}
            Price: ${booking.price}
            ${booking.description ? `Description: ${booking.description}` : ''}`,
        html: `<p>Hello <strong>${user.name}</strong>, your booking is confirmed!</p>
               <p><strong>Booking Code:</strong> ${booking.booking_code}</p>
               <p><strong>Slot:</strong> ${time_slot.name}</p>
               <p><strong>Number of People:</strong> ${booking.number_of_people}</p>
               <p><strong>Price:</strong> ${booking.price}</p>
               ${booking.description ? `<p><strong>Description:</strong> ${booking.description}</p>` : ''}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Booking email sent:', info.response);
   

};