import { Request, Response, NextFunction } from "express";
import { getDoctorAppointments } from "../services/doctor.services";
import dayjs from "dayjs";


export const getDoctorAppointmentsHandler = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const user = (req as any).user


        const { date, from, to, today } = req.query;

        let dateRange: { from: string; to: string } | undefined;
        console.log(req.query);

        if (today === "true") {
            const start = dayjs().startOf("day").toISOString();
            const end = dayjs().endOf("day").toISOString();
            dateRange = { from: start, to: end };
        } else if (date) {
            const start = dayjs(date as string).startOf("day").toISOString();
            const end = dayjs(date as string).endOf("day").toISOString();
            dateRange = { from: start, to: end };
        } else if (from && to) {
            dateRange = {
                from: dayjs(from as string).startOf("day").toISOString(),
                to: dayjs(to as string).endOf("day").toISOString(),
            };
        }


        const appointments = await getDoctorAppointments(user.userId, dateRange)

        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            appointments
        })

    } catch (error) {
        next(error)
    }
}
