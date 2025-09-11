import app from "./app";
import { AppDataSource } from "./config/data-source";
import { scheduleAutoCancelAppointments } from "./cron/autoCancelAppointments";
<<<<<<< Updated upstream
import { initSocket } from "./socket";
import http from "http";
=======
import { scheduleAppointmentReminders } from "./cron/scheduleAppointmentReminders";

>>>>>>> Stashed changes

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        const httpServer=http.createServer(app)

        initSocket(httpServer)

        httpServer.listen(PORT, () => {
            console.log(`server running at ${PORT}`);
        })
<<<<<<< Updated upstream
        
        // scheduleAutoCancelAppointments();

=======
        scheduleAutoCancelAppointments();
        scheduleAppointmentReminders();
>>>>>>> Stashed changes
    })
    .catch((err) => {
        console.log(`DB Connection error: ${err}`);

    })
