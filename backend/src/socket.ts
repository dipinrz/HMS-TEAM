import { Server } from "socket.io";

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

    socket.on("book_appointments",(data)=>{

      const{doctorId,appointmentInfo}=data
      console.log("hitted notification",doctorId,appointmentInfo)
      
      const doctorSocketId=connectedUsers.get(doctorId)

      if(doctorId){
        io.to(doctorSocketId).emit("appointment_notification",appointmentInfo)
        console.log(`Notification sent to doctor ${doctorId}`)
      }
    })

    socket.on("disconnect", () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
        }
      }
    });
  });
};
