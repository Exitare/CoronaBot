import axios from "axios";
import { ICountry, ICovidData } from "../Interfaces";

export class HttpService {


    public static async fetchCovidData(): Promise<ICovidData> {
        try{
            return new Promise(async (resolve) => {
                axios.get<ICountry[]>("https://api.covid19api.com/summary")
                    .then((response: any) => {
                        resolve(response.data);
                    }).catch(async (err: any) => {
                        console.log(err);
                        return [];
                    });
            });
        }
        catch(ex){
            return null;
        }
        
    }
}
