import { NextFunction, Request, Response } from "express";
import { notificationRepo } from "../services/notification.services";

export const fetchNotificationDoctor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user_id = Number(req.params.id)
        const data = await notificationRepo.find({ where: { receiverId: user_id } });
        
        res.status(200).json({ success: true, msg: "Notification fetched successfully", data });


    } catch (error) {
        next(error)

    }

}