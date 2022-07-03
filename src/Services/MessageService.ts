import { ICountry, IField } from "../Interfaces";
import { Colors } from "../Constants";
import { If, MessageEmbed } from "discord.js";
import moment from "moment";

export class MessageService {
    public static async CreateMultiCountryMessage(countryData: ICountry[]): Promise<MessageEmbed> {
        const countries: ICountry[] = [];
        for (const country of countryData)
            countries.push(country);

        countries.sort((n1, n2) => n2.NewConfirmed - n1.NewConfirmed);



        const trackedCountries: IField[] = [];

        let counter = 0;
        for (const country of countries) {
            if (counter >= 10)
                break;
                trackedCountries.push(MessageService.createCountryField(country));
            counter++;
        }

        const embedMessage = new MessageEmbed();
        embedMessage.setTitle(`Covid 19 Update ${moment().format("MMMM Do YYYY, HH:mm:ss")}`);


        embedMessage.setColor(Colors.CYAN);
        embedMessage.setTimestamp(new Date());
        //  embedMessage.setDescription(discordMessage.message);

        for (const trackedCountry of trackedCountries)
            embedMessage.addField(trackedCountry.name, trackedCountry.value);


        return embedMessage;
    }

    public static async CreateCountryMessage( countryData: ICountry): Promise<MessageEmbed> {
        const embedMessage = new MessageEmbed();
        embedMessage.setTitle(`Covid 19 Update ${moment().format("MMMM Do YYYY, HH:mm:ss")}`);
        embedMessage.setColor(Colors.CYAN);
        embedMessage.setTimestamp(new Date());
        //  embedMessage.setDescription(discordMessage.message);
        
        const countryField: IField = this.createCountryField(countryData);

        embedMessage.addField(countryField.name, countryField.value);


        return embedMessage;
    }

    private static createCountryField(country: ICountry): IField {
        return {
            name: country.Country,
            value: `New confirmed cases today: ${country.NewConfirmed}
            New deaths today: ${country.NewDeaths}
            Total cases: ${country.TotalConfirmed}
            Total deaths: ${country.TotalDeaths}
            Total Recovered: ${country.TotalRecovered}
            `,
        } as IField;
    }
}