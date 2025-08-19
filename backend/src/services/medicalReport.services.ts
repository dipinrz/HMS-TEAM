import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { MedicalReport } from "../entities/medicalReport.entity";
import { Medication } from "../entities/medication.entity";
import { Prescription } from "../entities/prescription.entity";


const medicalReportRepo = AppDataSource.getRepository(MedicalReport)
const appoinmentRepo = AppDataSource.getRepository(Appointment)
const prescriptionRepo = AppDataSource.getRepository(Prescription)
const medicationRepo = AppDataSource.getRepository(Medication)


export const createMedicalReport = async (medicalReport: Partial<MedicalReport>) => {

    const newMedicalReport = medicalReportRepo.create(medicalReport)


    return await medicalReportRepo.save(newMedicalReport)

}

export const getMedicalReportById = async (medicalReportId: number) => {
    return await medicalReportRepo.findOne({
        where: {
            record_id: medicalReportId
        },
        relations: ['patient']
    })
}

export const getMedicalReportByPId = async (patientId: number) => {


    return await medicalReportRepo.findOne({
        where: {
            patient: { user_id: patientId }
        },
        relations: ['patient']
    })
}

// export const getAppoinmentsByPatientId = async (patientId: number) => {
    
//     const appointments = await appoinmentRepo.find({
//         where: {
//         patient: { user_id: patientId }
//         },relations:['doctor','department'],
//     });

//     const results = await Promise.all(
//         appointments.map(async (appt) => {
//         const prescriptions = await getPrescriptionsByAppoinment(appt.appointment_id);
//         return { ...appt, prescriptions };
//         })
//     );

//     return results;
// };


export const getAppoinmentsByPatientId = async (patientId: number) => {
  const appointments = await appoinmentRepo.find({
    where: {
      patient: { user_id: patientId },
    },
    relations: ["doctor", "department"],
  });

  const results = await Promise.all(
    appointments.map(async (appt) => {
      const prescriptions = await getPrescriptionsByAppoinment(appt.appointment_id);
      const prescriptionsWithMedications = await Promise.all(
        prescriptions.map(async (presc) => {
          const medications = await medicationRepo.find({
            where: { prescription: { prescription_id: presc.prescription_id } },
            relations: ["medicine"],
          });

          return { ...presc, medications };
        })
      );

      return { ...appt, prescriptions: prescriptionsWithMedications };
    })
  );

  return results;
};


export const getPrescriptionsByAppoinment = async(appoinmentId:number)=>{
    
    return await prescriptionRepo.find({
        where: {
            appointment: {appointment_id: appoinmentId }
        },
        relations: ['appointment']
    })
}



