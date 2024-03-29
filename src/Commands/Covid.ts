import { CommandContext } from "../Models";
import { HttpService, MessageService } from "../Services";
import { ICommand, IField, ICountry, ICovidData } from "../Interfaces";
import { MessageEmbed } from "discord.js";
import { CountryCache } from '../Cache/Countries';

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
            let countries: ICountry[] = CountryCache.countries;

            if (countries.length === 0){
                const data: ICovidData = await HttpService.fetchCovidData();
             
                if (data && data.Countries.length > 0){
                    // Update cache only of new data is available
                    CountryCache.countries = data.Countries;
                    countries = data.Countries;
                }
                 
               
            }
               


            if (!countryName) {
                embedMessage = await MessageService.CreateMultiCountryMessage(countries);
                commandContext.originalMessage.channel.send({ embeds: [embedMessage] });
                return;
            }


            const country: ICountry = countries.find(x => x.Country === countryName);

            if (!country) {
                commandContext.originalMessage.channel.send(`Could not find country with the name ${countryName}`);
                return;
            }


            embedMessage = await MessageService.CreateCountryMessage(country);
            commandContext.originalMessage.channel.send({ embeds: [embedMessage] });


            return;
        } catch (ex) {
            commandContext.originalMessage.channel.send("An error occured in the covid info class! Please fix it!");
            return;
        }

    }

    hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
        return true;
    }
}
