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
        let faqID: number;

        if (commandContext.args.length > 0)
            faqID = Number(commandContext.args.shift());

        const response: ICountry[] = await HttpService.fetchCovidData();
        const embedMessage: MessageEmbed = await MessageService.CreateEmbdedMessage(response);
        


        commandContext.originalMessage.channel.send({ embeds: [embedMessage] });
    
        return;
    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
        return true;
    }
}
