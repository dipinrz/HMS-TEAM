import { io, Socket } from "socket.io-client";

export let socket: Socket;

export const initSocket = (userId: string) => {
  socket = io("http://localhost:5000", {
    auth: { userId },
  });

  // log events
  socket.on("connect", () => {
    console.log(" Socket connected with id:", socket.id);
  });

  // listen for appointment notifications from backend
  socket.on("appointment_notification", (appointmentInfo) => {
    console.log("New appointment notification:", appointmentInfo);

    // trigger a re-fetch of notifications
    // so Navbar count updates immediately
    window.dispatchEvent(new Event("refreshNotifications"));
  });
  socket.on("bill_notification", (data) => {
    console.log("connected", data);
    window.dispatchEvent(new Event("refreshNotifications"));


  })

  socket.on("disconnect", () => {
    console.log(" Socket disconnected");
  });

  return socket;
};

export const bookAppoinment = (user_id: number, appointmentInfo: any) => {
  socket.emit("book_appointments", { user_id, appointmentInfo });
};

export const billComplete = (user_id: number, patientId: string) => {
  socket.emit("bill", { user_id, patientId });
  alert("bill emited");
}