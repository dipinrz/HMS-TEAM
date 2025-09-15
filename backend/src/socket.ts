import { Server } from "socket.io";
import { createNotification } from "./services/notification.services";
import { Type } from "./entities/notification.entity";

export let io: Server;
export const connectedUsers = new Map<string, Set<string>>();

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    //  get userId from handshake auth (frontend sends this)
    const userId = String(socket.handshake.auth.userId);

    console.log("User connected:", socket.id, "userId:", userId);

    if (userId) {
      if (!connectedUsers.has(userId)) {
        connectedUsers.set(userId, new Set());
      }
      connectedUsers.get(userId)!.add(socket.id);
    }
    console.log("connectedUsers:", connectedUsers);

    socket.on("book_appointments", (data) => {
      const { user_id, appointmentInfo } = data;
      const type = Type.APPOINTMENT;
      const title = "Appointment Scheduled";
      createNotification(
        user_id,
        appointmentInfo.doctor.user_id,
        type,
        title,
        appointmentInfo.appointment_date
      );

      const doctorSocketIds = connectedUsers.get(
        String(appointmentInfo.doctor.user_id)
      );

      if (doctorSocketIds) {
        doctorSocketIds.forEach((sid) => {
          io.to(sid).emit("appointment_notification", appointmentInfo);
        });
        console.log(
          `Notification sent to doctor ${appointmentInfo.doctor.user_id}`
        );
      }
    });

    socket.on("bill", (data) => {
      const type = Type.BILL;
      const title = "Bill Created";
      const { user_id, patientId } = data;

      createNotification(user_id, patientId, type, title);

      const patientSocketIds = connectedUsers.get(String(patientId));
      console.log("connectedUsers:", connectedUsers);

      if (patientSocketIds) {
        patientSocketIds.forEach((sid) => {
          io.to(sid).emit("bill_notification", "connected");
        });
        console.log("bill emitted to patient", patientId);
      }
    });

    socket.on("disconnect", () => {
      // check if this socket is still the active one
      for (const [uid, socketSet] of connectedUsers.entries()) {
        if (socketSet.has(socket.id)) {
          socketSet.delete(socket.id);
          if (socketSet.size === 0) {
            connectedUsers.delete(uid);
            console.log(`User ${uid} disconnected (no active sockets)`);
          } else {
            console.log(
              `Socket ${socket.id} removed, user ${uid} still has active sockets`
            );
          }
        }
      }
    });
  });
};