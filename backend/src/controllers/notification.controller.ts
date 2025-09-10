import { NextFunction, Request, Response } from "express";
import { notificationRepo } from "../services/notification.services";

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
