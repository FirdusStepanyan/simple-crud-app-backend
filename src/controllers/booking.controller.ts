import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

const bookingService = new BookingService();

export class BookingController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { slot_id, number_of_people, description } = req.body;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const booking = await bookingService.createBooking(userId, slot_id, number_of_people, description);
      return res.status(201).json({ message: "Booking created", booking });
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  }

  static async getById(req: Request, res: Response) {
    const booking = await bookingService.getBookingById(Number(req.params.id));
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  }

  static async update(req: Request, res: Response) {
    const updated = await bookingService.updateBooking(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json(updated);
  }

  static async delete(req: Request, res: Response) {
    const deleted = await bookingService.deleteBooking(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Deleted", deleted });
  }
}
