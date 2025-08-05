import { AppDataSource } from "../config/data-source";
import { Prescription } from "../entities/prescription.entity";


const prescriptionRepo = AppDataSource.getRepository(Prescription)


export const createPrescription = async (prescription: Prescription) => {

    const newPrescription = prescriptionRepo.create(prescription)

    return await prescriptionRepo.save(newPrescription)

}

export const getPrescriptionById = async (prescriptionId: number) => {

    return await prescriptionRepo.findOne({
        where:{prescription_id:prescriptionId},
        relations:['appointment'],
        order:{
            prescribed_date: 'DESC'
        }
    })

}
