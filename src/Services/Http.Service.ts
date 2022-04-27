import axios from "axios";
import { ICountry } from "../Interfaces";

export class HttpService {


    public static async fetchCovidData(): Promise<ICountry[]> {
        return new Promise(async (resolve) => {
            axios.get<ICountry[]>("https://corona.lmao.ninja/v2/countries")
                .then((response: any) => {
                    resolve(response.data);
                }).catch((err: any) => console.log(err));
        });
    }
}
