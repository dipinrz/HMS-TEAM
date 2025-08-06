import { AppDataSource } from "../config/data-source";
import { Medicine } from "../entities/medicine.entity";


const medicineRepo = AppDataSource.getRepository(Medicine)

export const createMedicine = async (medicine: Partial<Medicine>) => {

    const newMedicine = medicineRepo.create(medicine)

    return await medicineRepo.save(newMedicine)
}


export const getAllMedicines = async () => {
    return await medicineRepo.find({})
}

export const getMedicineById = async (medicineId: number) => {
    return await medicineRepo.findOneBy({ medicine_id: medicineId })
}


