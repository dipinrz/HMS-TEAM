import { AppDataSource } from "../config/data-source"
import { Notification } from "../entities/notification.entity"
import { getUserById } from "./user.services";
export const notificationRepo = AppDataSource.getRepository(Notification);


export const appointmentNotification = async (senderId, appointmentInfo, type, title) => {

    try {

        const { doctor_id, appointment_date } = appointmentInfo;


        const user = await getUserById(senderId);
        const dateStr = new Date(appointment_date).toLocaleDateString();
        const timeStr = new Date(appointment_date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });


        let sender: number;
        let receiver: number;
        let message: string;


        if (type == 'appointment') {
            sender = senderId;
            receiver = doctor_id;
            message = `${user.first_name} booked an appointment on ${dateStr} at ${timeStr}.`;



        }
        else if (type == 'bill') {
            sender = doctor_id;
            receiver = senderId;
            message = `Your  bill has been generated for your appointment on ${dateStr} at ${timeStr}.`;

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

export const getNotificationById=async(notifId:number)=>{
    return await notificationRepo.findOne({
    where:{id:notifId}
  })
}