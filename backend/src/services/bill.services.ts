import { AppDataSource } from "../config/data-source";
import { Bill, PaymentStatus } from "../entities/bill.entity";


const billRepo = AppDataSource.getRepository(Bill)


export const createBill = async (bill: Partial<Bill>) => {
    const newBill = billRepo.create(bill)


    return await billRepo.save(newBill)

}

export const getBillById = async (billId: number) => {
    return await billRepo.findOne({
        where: { bill_id: billId },
    })
}


export const getBillsByPatientId = async (patientId: number, isPaid?: boolean) => {
    
    const where: any = {
        patient: { user_id: patientId }
    };

    if (isPaid === true) {
        where.payment_status = 'paid';
    } else if (isPaid === false) {
        where.payment_status = 'unpaid';
    }

    return await billRepo.find({
        where,
        relations: ['appointment'],
        order: {
        billing_date: 'DESC',
        },
    });
};


export const updateBillById = async (billId: number, updatedData: Partial<Bill>) => {
    
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

export const getBillByAppointmentId = async(appointmentId: number) => {
    return await billRepo.findOne({
        where:{
            appointment: {appointment_id: appointmentId }
        },
        relations: ['appointment'],
    })
}

export const deleteBillById = async(billId: number) => {
    
    return await billRepo.delete({ bill_id: billId });
}

export const markBillAsPaid = async (bill: Partial<Bill>)=> {

    if (bill.payment_status === PaymentStatus.PAID) {
        return true;
    }

    bill.payment_status = PaymentStatus.PAID;

    await billRepo.save(bill);

    return true;
};
