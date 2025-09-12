import app from "./app";
import { AppDataSource } from "./config/data-source";
import { scheduleAutoCancelAppointments } from "./cron/autoCancelAppointments";
import { initSocket } from "./socket";
import http from "http";
import { scheduleAppointmentReminders } from "./cron/scheduleAppointmentReminders";


const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        const httpServer=http.createServer(app)

        initSocket(httpServer)

        httpServer.listen(PORT, () => {
            console.log(`server running at ${PORT}`);
        })
        
        // scheduleAutoCancelAppointments();

        scheduleAutoCancelAppointments();
        scheduleAppointmentReminders();
    })
    .catch((err) => {
        console.log(`DB Connection error: ${err}`);

    })
