import { ICountry, IField } from "../Interfaces";
import { Colors } from "../Constants";
import { If, MessageEmbed } from "discord.js";
import moment from "moment";

export class MessageService {
    public static async CreateMultiCountryMessage(countryData: ICountry[]): Promise<MessageEmbed> {
        const countries: ICountry[] = [];
        for (const country of countryData)
            countries.push(country);

        countries.sort((n1, n2) => n2.todayCases - n1.todayCases);



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
            name: country.country,
            value: `New cases today: ${country.todayCases}
            New deaths today: ${country.todayDeaths}
            Total cases: ${country.cases}
            Total deaths: ${country.deaths}
            Total Recovered: ${country.recovered}
            Total Critical: ${country.critical}
            Total Active: ${country.active}
            Total Tests: ${country.tests}
            `,
        } as IField;
    }
}