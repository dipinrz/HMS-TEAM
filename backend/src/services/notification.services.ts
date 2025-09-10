import { AppDataSource } from "../config/data-source"
import { Notification } from "../entities/notification.entity"
export const notificationRepo = AppDataSource.getRepository(Notification);


export const appointmentNotification = async (senderId, appointmentInfo) => {

    try {
        const { doctor_id, appointment_date, reason_for_visit } = appointmentInfo;


        const message = `Reason: ${reason_for_visit || "N/A"}, Date: ${new Date(
            appointment_date
        ).toLocaleDateString()}, Time: ${new Date(appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        // notificationRepo.create()


        const newNotification = notificationRepo.create({
            senderId,
            receiverId: doctor_id, // doctor gets the notification
            title: "New Appointment Scheduled",
            message,
            appointmentId: appointmentInfo.id, // if appointment id exists
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