import { Server } from "socket.io";
import { appointmentNotification } from "./services/notification.services";

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
    const userId = socket.handshake.auth.userId as string;

    console.log("User connected:", socket.id, "userId:", userId);

    if (userId) {
      connectedUsers.set(userId, socket.id);
    }
    console.log("arrays ", connectedUsers);

    socket.on("book_appointments", (data) => {
      const { user_id, appointmentInfo } = data;
      appointmentNotification(user_id, appointmentInfo);
      console.log("hitted notification", appointmentInfo);
      console.log("sender id", userId);

      const doctorSocketId = connectedUsers.get(appointmentInfo.doctor_id);

      if (appointmentInfo.doctor_id) {
        io.to(doctorSocketId).emit("appointment_notification", appointmentInfo);
        console.log(`Notification sent to doctor ${appointmentInfo.doctor_id}`);
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
