import { NextFunction, Request, Response } from "express";
import {
  getNotificationById,
  notificationRepo,
} from "../services/notification.services";
import { number } from "joi";
import { Status } from "../entities/notification.entity";
import { ApiError } from "../utils/apiError";

export const fetchNotification = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.user;

    const data = await notificationRepo.find({
      where: { receiverId: userId },
    });
    

    res
      .status(200)
      .json({ success: true, msg: "Notification fetched successfully", data });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notifID } = req.params;
    const notification = await getNotificationById(Number(notifID));
    if (!notification) {
      throw new ApiError("No notification found", 404);
    }
    
    notification.status = Status.READ; 

    await notificationRepo.save(notification); 

    return res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};
