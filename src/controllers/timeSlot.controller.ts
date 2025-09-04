import { Request, Response } from "express";
import { sendResponse } from "../helpers/utils/response";
import timeSlotService from "../services/timeSlot.service";

class TimeSlotController {
  async create(req: any, res: Response) {
    try {
      const adminId = req.user.id;
      const slot = await timeSlotService.createTimeSlot(adminId, req.body);
      sendResponse(res, slot, "Time slot created successfully");
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const slots = await timeSlotService.getAllTimeSlots();
      sendResponse(res, slots);
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const slot = await timeSlotService.getTimeSlotById(Number(req.params.id));
      sendResponse(res, slot);
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const slot = await timeSlotService.updateTimeSlot(Number(req.params.id), req.body);
      sendResponse(res, slot, "Time slot updated successfully");
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const result = await timeSlotService.deleteTimeSlot(Number(req.params.id));
      sendResponse(res, result);
    } catch (error: unknown) {
      sendResponse(res, null, error instanceof Error ? error.message : "Unknown error", 500);
    }
  }
}

export default new TimeSlotController();
