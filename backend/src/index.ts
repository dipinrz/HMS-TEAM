import app from "./app";
import { AppDataSource } from "./config/data-source";
import { scheduleAutoCancelAppointments } from "./cron/autoCancelAppointments";
import { initSocket } from "./socket";
import http from "http";

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        const httpServer=http.createServer(app)

        initSocket(httpServer)

        httpServer.listen(PORT, () => {
            console.log(`server running at ${PORT}`);
        })
        
        // scheduleAutoCancelAppointments();

    })
    .catch((err) => {
        console.log(`DB Connection error: ${err}`);

    })
