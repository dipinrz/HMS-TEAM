import cron from 'node-cron';
import { Between, Repository } from 'typeorm';
import dayjs from 'dayjs';
import { AppDataSource } from '../config/data-source';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { sendEmail } from '../utils/email';

export const scheduleAppointmentReminders = async () => {
    const appointmentRepo = AppDataSource.getRepository(Appointment);

    cron.schedule('* * * * *', async () => {
        console.log("Running appointment reminder...");

        const now = dayjs();
        const startTime = now.add(2, 'hour').startOf('minute').toDate();
        const endTime = now.add(2, 'hour').endOf('minute').toDate();

        try {
            const appointments = await appointmentRepo.find({
                where: {
                    // appointment_date: Between(startTime, endTime),
                    status: AppointmentStatus.SCHEDULED,
                    reminder_send: false,
                },
                relations: ['patient', 'doctor', 'department'],
            });
            for (const appointment of appointments) {
                const patient = appointment.patient;

                if (!patient?.email) {
                    console.warn(`No email for patient ID ${patient?.user_id}`);
                    continue;
                }
                const appointmentTime = dayjs(appointment.appointment_date).format('HH:mm');

                const start = dayjs(appointment.appointment_date);
                const end = start.add(30, 'minute'); // or whatever the duration is

                const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
                const title = encodeURIComponent('Doctor Appointment - HMS Clinic');
                const dates = `${start.format('YYYYMMDDTHHmmss')}/${end.format('YYYYMMDDTHHmmss')}`;
                const details = encodeURIComponent(`Reason: ${appointment.reason_for_visit || 'N/A'}`);
                const location = encodeURIComponent('HMS Clinic, Trivandrum');

                const calendarUrl = `${baseUrl}&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;


                const text = `Hi ${patient.first_name}, your appointment is at ${appointmentTime}.`;
                const html = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Appointment Reminder</title>
                    </head>
                    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
                        <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin: 30px auto; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                            <!-- Header -->
                            <tr>
                                <td style="background-color: #4CAF50; padding: 20px; color: white; text-align: center;">
                                <h1 style="margin: 0; font-size: 24px;">HMS Clinic</h1>
                                <p style="margin: 0; font-size: 14px;">Your health, our priority</p>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding: 30px;">
                                <p style="font-size: 16px; color: #333;">Hi <strong>${patient.first_name}</strong>,</p>

                                <p style="font-size: 16px; color: #333;">
                                    This is a friendly reminder for your upcoming appointment scheduled at 
                                    <strong style="color: #4CAF50;">${appointmentTime}</strong> today.
                                </p>

                                <p style="font-size: 16px; color: #333;">
                                    <strong>Reason for visit:</strong> ${appointment.reason_for_visit || 'N/A'} <br/>
                                    <strong>Doctor:</strong> ${appointment.doctor.first_name || 'N/A'}<br/>
                                    <strong>Department:</strong> ${appointment.department.name || 'N/A'}
                                </p>

                                

                                <!-- Optional CTA -->
                                <p style="text-align: center; margin: 30px 0;">
                                    <a href="http://localhost:5173/patient/appointments" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    View Appointment Details
                                    </a>
                                </p>

                                <p style="text-align: center; margin: 30px 0;">
                                    <a href="${calendarUrl}" 
                                    style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    Add to Google Calendar
                                    </a>
                                </p>

                                <p style="font-size: 14px; color: #666;">
                                    If you have any questions or need to reschedule, please contact our support team.
                                </p>

                                <p style="font-size: 16px; color: #333;">Thank you,<br><strong>HMS Clinic Team</strong></p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f4f4f4; text-align: center; padding: 20px; font-size: 12px; color: #888;">
                                HMS Clinic, 123 Wellness St., Healthy City<br/>
                                <a href="#" style="color: #888; text-decoration: none;">Unsubscribe</a>
                                </td>
                            </tr>

                            </table>
                        </td>
                        </tr>
                    </table>

                    </body>
                    </html>
                    `;

                await sendEmail(patient.email, 'Appointment Reminder', text, html);
                appointment.reminder_send = true;
                await appointmentRepo.save(appointment);

                console.log(`Reminder sent to ${patient.email} for appointment ${appointment.appointment_id}`)
            }
        } catch (err) {
            console.error('[Cron] Error sending reminders:', err);
        }
    })
}