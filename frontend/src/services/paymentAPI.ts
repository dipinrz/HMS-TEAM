import commonAPI from "./commonAPI";

export const baseURL = "http://localhost:5000/api/v1";

export const createOrder = async(billAmount: number) => {
    return await commonAPI('POST',
                `${baseURL}/payment/create-order`,
                { amount: billAmount },
            );
}