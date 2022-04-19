import { CommandContext } from "../Models";
import { HttpService } from "../Services";
import { ICommand, IField, ICountry } from "../Interfaces";
import { Colors } from "../Constants";
import { MessageEmbed } from "discord.js";
import moment from "moment";

export class CovidInfo implements ICommand {
    commandNames = ["covid", "corona", "cv19"];

    getHelpMessage(commandPrefix: string): string {
        return `Use ${commandPrefix}cv19 to get the latest data about covid.`;
    }

    async run(commandContext: CommandContext): Promise<void> {
        let faqID: number;

        if (commandContext.args.length > 0)
            faqID = Number(commandContext.args.shift());

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
            fields.push(CovidInfo.addField(country));
            counter++;
        }

        const embedMessage = new MessageEmbed();


        embedMessage.setTitle(`Covid 19 Update ${moment().format("MMMM Do YYYY, HH:mm:ss")}`);


        embedMessage.setColor(Colors.CYAN);
        embedMessage.setTimestamp(new Date());
        //  embedMessage.setDescription(discordMessage.message);

        for (const field of fields)
            embedMessage.addField(field.name, field.value);


        commandContext.originalMessage.channel.send({ embeds: [embedMessage] });
        //  await ReplyService.sendMessages(commandContext, "Covid stats", "Covic stats", Colors.CYAN, fields);

        return;
    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
        return true;
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
