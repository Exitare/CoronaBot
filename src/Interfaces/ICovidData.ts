import { ICountry } from "./ICountry";

export interface ICovidData{
    ID: string,
    Message: string,
    Global: any,
    Countries: ICountry[]
}