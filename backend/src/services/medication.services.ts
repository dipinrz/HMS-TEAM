import { AppDataSource } from "../config/data-source";
import { Medication } from "../entities/medication.entity";


const medicationRepo = AppDataSource.getRepository(Medication)

export const createMedication = async (medication: Partial<Medication>) => {

    const newMedication = medicationRepo.create(medication)

    return await medicationRepo.save(newMedication)

}

export const getMedicationById = async (medicationId: number) => {
    return await medicationRepo.findOne({
        where: { medication_id: medicationId },
        relations: ['prescription']

    })
}

export const getMedicinesOfPrescription = async (prescriptionId: number) => {

    return await medicationRepo.find({
        where: {
            prescription: { prescription_id: prescriptionId }
        }
    })
}