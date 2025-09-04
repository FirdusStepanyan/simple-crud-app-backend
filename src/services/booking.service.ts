import { Booking } from "../models/book.model";
import { BookingRepository } from "../repositories/booking.repositori";
import AppDataSource from "../database";
import UserSchema from "../models/user.model";
import TimeSlotSchema from "../models/timeSlot.model";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { sendBookmail } from "../controllers/notification.controller";
import { calculateBookPrice } from "../helpers/utils/booking.helper";
//import { sendVerificationEmail } from "./mailer";

export class BookingService {
  private bookingRepo = new BookingRepository();

  private generateBookingCode(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `B${random}`;
  }

//   private async sendPDFEmail(userEmail: string, booking: Booking) {
//     const pdfDir = path.join(__dirname, "../temp");
//     if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

//     const pdfPath = path.join(pdfDir, `${booking.booking_code}.pdf`);
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(pdfPath));
//     doc.fontSize(16).text("Booking Information", { underline: true });
//     doc.moveDown();
//     doc.text(`Booking Code: ${booking.booking_code}`);
//     doc.text(`User: ${booking.user.name} ${booking.user.lastname}`);
//     doc.text(`Slot: ${booking.time_slot_id.name}`);
//     doc.text(`Number of People: ${booking.number_of_people}`);
//     doc.text(`Price: ${booking.price}`);
//     if (booking.description) doc.text(`Description: ${booking.description}`);
//     doc.end();

//     await sendVerificationEmail(userEmail, booking.booking_code);

//     setTimeout(() => fs.existsSync(pdfPath) && fs.unlinkSync(pdfPath), 30000);
//   }

  async createBooking(userId: number, slotId: number, number_of_people: number, description?: string): Promise<Booking> {
    const userRepo = AppDataSource.getRepository(UserSchema);
    const slotRepo = AppDataSource.getRepository(TimeSlotSchema);

    const user = await userRepo.findOne({ where: { id: userId } });
    const slot = await slotRepo.findOne({ where: { id: slotId }, relations: ["user"] });

    if (!user || !slot) throw new Error("User or slot not found");

    const existingBooking = await this.bookingRepo.findOneByUserAndSlot(user.id, slot.id);
    if (existingBooking) throw new Error("You have already booked this slot");

    const bookingData: Partial<Booking> = {
      user,
      admin: slot.user,
      time_slot_id: slot,
      number_of_people,
      price: calculateBookPrice(slot, number_of_people),
      booking_code: this.generateBookingCode(),
      description,
    };

    const booking = await this.bookingRepo.createBooking(bookingData);
    await sendBookmail(user, booking, slot);

    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.bookingRepo.findAll();
  }

  async getBookingById(id: number): Promise<Booking | null> {
    return this.bookingRepo.findById(id);
  }

  async updateBooking(id: number, data: Partial<Booking>): Promise<Booking | null> {
    return this.bookingRepo.updateBooking(id, data);
  }

  async deleteBooking(id: number): Promise<Booking | null> {
    return this.bookingRepo.deleteBooking(id);
  }
}
