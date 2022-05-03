import { CommandContext } from "../Models";
import { HttpService, MessageService } from "../Services";
import { ICommand, IField, ICountry } from "../Interfaces";
import { MessageEmbed } from "discord.js";

export class CovidInfo implements ICommand {
    commandNames = ["covid", "corona", "cv19"];

    getHelpMessage(commandPrefix: string): string {
        return `Use ${commandPrefix}cv19 to get the latest data about covid.`;
    }

    async run(commandContext: CommandContext): Promise<void> {
        try {
            let countryName: string;

            if (commandContext.args.length > 0)
                countryName = commandContext.args.shift();


            let embedMessage: MessageEmbed;
            const response: ICountry[] = await HttpService.fetchCovidData();
            if (!countryName) {
                embedMessage = await MessageService.CreateMultiCountryMessage(response);
                commandContext.originalMessage.channel.send({ embeds: [embedMessage] });
                return;
            }


            const country: ICountry = response.find(x => x.country === countryName);

            if (!country) {
                commandContext.originalMessage.channel.send(`Could not find country with the name ${countryName}`);
                return;
            }


            embedMessage = await MessageService.CreateCountryMessage(country);
            commandContext.originalMessage.channel.send({ embeds: [embedMessage] });


            return;
        } catch (ex) {
            commandContext.originalMessage.channel.send("An error occured! Please fix it!");
            return;
        }

    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
        return true;
    }
}
