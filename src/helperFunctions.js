import { baseRate } from "./globalConstants";

export const getDiscount = (amount, discount) => {
    
    let charges = +amount + baseRate;

    let discountedPrice = charges - (charges * discount / 100);


    return {
        distanceCost: amount,
        discountedPrice,
        discount
    }


}