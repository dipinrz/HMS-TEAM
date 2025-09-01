import { AppDataSource } from "../config/data-source";
import { Appointment } from "../entities/appointment.entity";
import { MedicalReport } from "../entities/medicalReport.entity";
import { Medication } from "../entities/medication.entity";
import { Prescription } from "../entities/prescription.entity";


const medicalReportRepo = AppDataSource.getRepository(MedicalReport)
const appoinmentRepo = AppDataSource.getRepository(Appointment)
const prescriptionRepo = AppDataSource.getRepository(Prescription)
const medicationRepo = AppDataSource.getRepository(Medication)

interface Course {
  medicine_name:string
  dosage:string
  frequency:number
  duration:number
  start_date:string
  end_date:string

}


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


// {
//             "medicine_name": "Paracetamol",
//             "dosage": "5",
//             "frequency": 2,
//             "duration": 5,
//             "start_date": "2025-08-28",
//             "end_date": "2025-09-02"
//         }



export const extractMedicineCourse = (appointments: any[]) => {
  const courses: Course[] = [];

  appointments.forEach((appointment) => {
    appointment.prescriptions.forEach((prescription) => {
      const prescribedDate = new Date(prescription.prescribed_date);

      prescription.medications.forEach((med) => {
        const startDate = prescribedDate;
        const endDate = new Date(prescribedDate);
        endDate.setDate(endDate.getDate() + med.duration); 

        courses.push({
          medicine_name: med.medicine.medicine_name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        });
      });
    });
  });

  return courses;
};


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
        relations: ['appointment', 'appointment.doctor']
    })
}



