import { AppDataSource } from "../config/data-source";
import { MedicalReport } from "../entities/medicalReport.entity";


const medicalReportRepo = AppDataSource.getRepository(MedicalReport)


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
        }
    })
}