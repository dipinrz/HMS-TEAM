import { AppDataSource } from "../config/data-source";
import { Bill } from "../entities/bill.entity";


const billRepo = AppDataSource.getRepository(Bill)


export const createBill = async (bill: Partial<Bill>) => {
    const newBill = billRepo.create(bill)


    return await billRepo.save(newBill)

}

export const getBillById = async (billId: number) => {
    return await billRepo.find({
        where: { bill_id: billId },
    })
}


export const getBillsByPatientId = async (patientId: number) => {
    return await billRepo.find({
        where: {
            patient: { user_id: patientId }
        },
        relations: ['appointment'],
        order: {
            billing_date: 'DESC'
        }
    })
}

export const getBillByAppointmentId = async (appointmentId: number) => {
    return await billRepo.findOne({
        where: {
            appointment: { appointment_id: appointmentId }
        }
    })
}

export const updateBillById = async (billId: number, updatedData: Partial<Bill>) => {

    console.log(updatedData);
    
    return await billRepo.update(
        { bill_id: billId },
        updatedData
    )
}

export const getAllBills = async () => {
    return await billRepo.find({
        relations: ['appointment'],
        order: {
            billing_date: 'DESC'
        }


    })
}