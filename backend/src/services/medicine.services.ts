import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Medicine } from "../entities/medicine.entity";


const medicineRepo = AppDataSource.getRepository(Medicine)

export const findMedicine = async(medicine_id)=>{
    const medicine = await medicineRepo.findOne({where:{medicine_id:medicine_id}})
    return medicine
}

export const createMedicineService = async (medicine: Partial<Medicine>) => {

    const newMedicine = medicineRepo.create(medicine)
    return await medicineRepo.save(newMedicine)
}


export const getAllMedicines = async () => {
    return await medicineRepo.find({})
}

export const getMedicineById = async (medicineId: number) => {
    return await medicineRepo.findOneBy({ medicine_id: medicineId })
}


export const getMedicinesByIds = async (medicineIds: [number]) => {
    return await medicineRepo.findBy({
        medicine_id: In(medicineIds)
    })
}
