import cron from 'node-cron'
import { AppDataSource } from '../config/data-source';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';

export const scheduleAutoCancelAppointments=()=>{
    cron.schedule('0 18 * * *',async()=>{
        console.log('Running auto cancelv status');
        try{
            const appointmentRepo=AppDataSource.getRepository(Appointment);
            const result=await appointmentRepo.createQueryBuilder()
            .update(Appointment)
            .set({status:AppointmentStatus.CANCELLED})
            .where('status=:status',{status:AppointmentStatus.SCHEDULED})
            .andWhere('appointment_date<CURRENT_DATE')
            .execute();

            console.log(`cancelld ${result.affected} outdated appointment`);
        }catch(err){
            console.log('Faild to autocancel appointment',err);
        }
        
    })
}