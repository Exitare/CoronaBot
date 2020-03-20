import { HttpService } from ".";
import { ICountry, IField } from "../Interfaces";
import { Colors, ChannelID } from "../Constants";
import client from "../CoronaBot";
import { RichEmbed, TextChannel } from "discord.js";
import moment from "moment";
import { TimerService } from "./Timer.Service";

export class CovidInfos {
    public static async getInfos(): Promise<void> {
        const response: any = await HttpService.get();

        const countries: ICountry[] = [];
        for (const country of response)
            countries.push(country);

        countries.sort((n1, n2) => n2.todayCases - n1.todayCases);



        const fields: IField[] = [];

        let counter = 0;
        for (const country of countries) {
            if (counter >= 10)
                break;
            fields.push(CovidInfos.addField(country));
            counter++;
        }

        const embedMessage = new RichEmbed();
        embedMessage.setTitle(`Covid 19 Update ${moment().format("MMMM Do YYYY, HH:mm:ss")}`);


        embedMessage.setColor(Colors.CYAN);
        embedMessage.setTimestamp(new Date());
        //  embedMessage.setDescription(discordMessage.message);

        for (const field of fields)
            embedMessage.addField(field.name, field.value);

        (client.discordClient.channels.get(ChannelID.COVID_CHANNEL) as TextChannel).send(embedMessage);

        TimerService.rescheduleTimer(1, CovidInfos.getInfos, 10800000);
    }

    private static addField(country: ICountry): IField {
        return {
            name: country.country,
            value: `
            New cases today: ${country.todayCases}
            New deaths today: ${country.todayDeaths}
            Total cases: ${country.cases}
            Total deaths: ${country.deaths}
            Recovered: ${country.recovered}
            Critical: ${country.critical}
            Active: ${country.active}
            -----------------------------
            `,
        };
    }
}