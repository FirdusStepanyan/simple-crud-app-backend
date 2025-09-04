import { PriceType } from "../../models/timeSlot.model";

export const calculateBookPrice = (time_slot: { price: any; price_type: PriceType; tax: any; }, number_of_people: number) => {
    let price = time_slot.price;
    if(time_slot.price_type === PriceType.PER_PRICE){
        price *= number_of_people;
    }

    let tax = time_slot.tax;
    if(tax && tax > 0){
        let taxPrice = price * tax / 100;
        price += taxPrice;
    }

    return price;
};
