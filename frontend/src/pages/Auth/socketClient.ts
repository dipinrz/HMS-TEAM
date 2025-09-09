import { io, Socket } from "socket.io-client";

export let socket: Socket;

export const initSocket = (userId: string) => {
  socket = io("http://localhost:5000", {
    auth: { userId },
  });

  // log events
  socket.on("connect", () => {
    console.log("✅ Socket connected with id:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected");
  });

  return socket;
};

export const bookAppoinment=(doctorId:string,appointmentInfo:any)=>{
    socket.emit("book_appointments",{doctorId,appointmentInfo})
}
