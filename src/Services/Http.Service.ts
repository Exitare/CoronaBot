import axios from "axios";

export class HttpService {


    public static async get(): Promise<any> {
        return new Promise(async (resolve) => {
            axios.get("https://corona.lmao.ninja/v2/countries")
                .then((response: any) => {
                    resolve(response.data);
                }).catch((err: any) => console.log(err));
        });
    }
}
