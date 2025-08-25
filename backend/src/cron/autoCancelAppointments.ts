import cron from 'node-cron'
import { AppDataSource } from '../config/data-source';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Bill } from '../entities/bill.entity';

export const scheduleAutoCancelAppointments = () => {
  cron.schedule('0 18 * * *', async () => {
    console.log('Running auto-cancel for expired appointments');

    try {
      const appointmentRepo = AppDataSource.getRepository(Appointment);
      const billRepo = AppDataSource.getRepository(Bill);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      
      const expiredAppointments = await appointmentRepo
        .createQueryBuilder('appointment')
        .select('appointment.appointment_id', 'appointment_id')
        .where('appointment.status = :status', { status: AppointmentStatus.SCHEDULED })
        .andWhere('appointment.appointment_date < :today', { today })
        .getRawMany();

      const appointmentIds = expiredAppointments.map(a => a.appointment_id);

      if (appointmentIds.length === 0) {
        console.log('No expired appointments to cancel.');
        return;
      }

     
      const deletedBills = await billRepo
        .createQueryBuilder()
        .delete()
        .from(Bill)
        .where('appointment_id IN (:...ids)', { ids: appointmentIds })
        .execute();

      console.log(`Deleted ${deletedBills.affected} bill(s).`);

      
      const updatedAppointments = await appointmentRepo
        .createQueryBuilder()
        .update(Appointment)
        .set({ status: AppointmentStatus.CANCELLED })
        .where('appointment_id IN (:...ids)', { ids: appointmentIds })
        .execute();

      console.log(`Cancelled ${updatedAppointments.affected} appointment(s).`);
    } catch (err) {
      console.error('Failed to auto-cancel appointments:', err);
    }
  });
};