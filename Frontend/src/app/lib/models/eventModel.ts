import { propertyModel } from "./propertyModel";

export class eventModel{
    _id?:string;
    name?: string;
    date?: string;
    description?: string;
    price?: number;
    capacity?: number;
    availability?: boolean;
    property?: propertyModel;
}