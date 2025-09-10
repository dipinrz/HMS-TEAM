import { AppDataSource } from "../config/data-source"
import { Notification, Type } from "../entities/notification.entity"
import { getUserById } from "./user.services";
export const notificationRepo = AppDataSource.getRepository(Notification);


export const createNotification = async (senderId ,receiverId, type:Type, title, appointment_date?: any) => {

    try {



        const user = await getUserById(senderId);



        let sender: number;
        let receiver: number;
        let message: string;


        if (type == 'appointment') {

            const dateStr = new Date(appointment_date).toLocaleDateString();
            const timeStr = new Date(appointment_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            sender = senderId;
            receiver = receiverId;
            message = `${user.first_name} booked an appointment on ${dateStr} at ${timeStr}.`;



        }
        else if (type == 'bill') {
            sender = senderId;


            receiver = receiverId;
            message = `Your  bill has been generated for your appointment on .`;

        }


        const newNotification = notificationRepo.create({
            senderId: sender,
            receiverId: receiver,
            title,
            message,
            type,
        });

        await notificationRepo.save(newNotification);

        console.log("saved the contents in the notification entity");





    } catch (error) {
        console.error("Error creating appointment notification:", error);

    }


}

export const getNotificationById = async (notifId: number) => {
    return await notificationRepo.findOne({
        where: { id: notifId }
    })
}