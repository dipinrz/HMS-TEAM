import commonAPI from "./commonAPI";

export const baseURL =import.meta.env.VITE_BASE_URL ;

export const createOrder = async(billAmount: number) => {
    return await commonAPI('POST',
                `${baseURL}/payment/create-order`,
                { amount: billAmount },
            );
}