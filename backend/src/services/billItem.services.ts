import { AppDataSource } from "../config/data-source";
import { BillItem } from "../entities/billItem.entity";



const billItemRepo = AppDataSource.getRepository(BillItem)

export const createBillItem = async (billItem: Partial<BillItem>) => {

    const newBillItem = billItemRepo.create(billItem)

    return await billItemRepo.save(newBillItem)

}

export const getBillItemById = async (billItemId: number) => {

    return await billItemRepo.findOneBy({ bill_item_id: billItemId })
}


export const deleteBillItem = async (billItemId: number) => {

    return await billItemRepo.delete({ bill_item_id: billItemId })
}

export const getBillItemBybillId = async (bill_id: number) => {

    return await billItemRepo.find({ where: {
        bill: {bill_id: bill_id}
    }, relations: ['medication', 'medication.medicine'] })
}