import { Server } from "socket.io";
import { createNotification } from "./services/notification.services";
import { Type } from "./entities/notification.entity";

export let io: Server;
export const connectedUsers = new Map<string, string>();

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    //  get userId from handshake auth (frontend sends this)
    const userId = String(socket.handshake.auth.userId);

    console.log("User connected:", socket.id, "userId:", userId);

    if (userId) {
      connectedUsers.set(userId, socket.id);
    }
    console.log("arrays ", connectedUsers);

    socket.on("book_appointments", (data) => {
      const { user_id, appointmentInfo } = data;
      const type = Type.APPOINTMENT;
      const title = "Appointment Scheduled";
      createNotification(
        user_id,
        appointmentInfo.doctor_id,
        type,
        title,
        appointmentInfo.appointment_date
      );
      console.log("hitted notification", appointmentInfo);
      console.log("sender id", userId);

      const doctorSocketId = connectedUsers.get(
        String(appointmentInfo.doctor_id)
      );
      if (appointmentInfo.doctor_id) {
        io.to(doctorSocketId).emit("appointment_notification", appointmentInfo);
        console.log(`Notification sent to doctor ${appointmentInfo.doctor_id}`);
      }
    });
    socket.on("bill", (data) => {
      const type = Type.BILL;
      const title = "Bill Created";
      const { user_id, patientId } = data;

      createNotification(user_id, patientId, type, title);

      const patientSocketId = connectedUsers.get(String(patientId));
      console.log("this is the conected users", connectedUsers);

      if (patientId) {
        io.to(patientSocketId).emit("bill_notification", "connected");
        console.log("bill emitted", patientSocketId, patientId);
      }
    });

    socket.on("disconnect", () => {
      // check if this socket is still the active one
      for (const [uid, sid] of connectedUsers.entries()) {
        if (sid === socket.id) {
          // only remove if this was the latest socket for that user
          if (connectedUsers.get(uid) === socket.id) {
            connectedUsers.delete(uid);
            console.log(`User ${uid} disconnected (no active socket)`);
          }
        }
      }
    });
  });
};
