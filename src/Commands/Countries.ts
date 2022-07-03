import { CommandContext } from "../Models";
import { HttpService, MessageService } from "../Services";
import { ICommand, IField, ICountry } from "../Interfaces";
import { MessageEmbed } from "discord.js";
import { Colors } from "../Constants";
import { CountryCache } from "../Cache/Countries";

export class CountryInfo implements ICommand {
    commandNames = ["countries", "c"];

    getHelpMessage(commandPrefix: string): string {
        return `Use ${commandPrefix}countries to get a list of all possible countries.`;
    }

    async run(commandContext: CommandContext): Promise<void> {
        try {

            const countryNames: string[] = CountryCache.countryNames;

            if (countryNames.length === 0) {
                const data = await HttpService.fetchCovidData();
                console.log(data);
                const response: ICountry[] = data;

                for (const country of response)
                    countryNames.push(country.country)
            }
            const embedMessage = new MessageEmbed();
            embedMessage.setTitle(`Available Countries`);
            embedMessage.setColor(Colors.GREEN);
            embedMessage.setTimestamp(new Date());
            //  embedMessage.setDescription(discordMessage.message);


            let countryList: string = '';
            for (const countryName of countryNames) {
                if (countryList.length + countryName.length >= 1024) {
                    const countryNameField: IField = {
                        name: "Countries",
                        value: countryList,
                    } as IField;
                    embedMessage.addField(countryNameField.name, countryNameField.value);

                    countryList = countryName + `\n `;

                    continue;
                }



                countryList += countryName + `\n`;
            }

            const countryNameField: IField = {
                name: "Countries",
                value: countryList,
            } as IField;
            embedMessage.addField(countryNameField.name, countryNameField.value);

            // Send message
            commandContext.originalMessage.channel.send({ embeds: [embedMessage] });


            return;
        } catch (ex) {
            console.log(ex);
            commandContext.originalMessage.channel.send("An error occured in the countries command. Please fix it!");
            return;
        }

    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
        return true;
    }
}
