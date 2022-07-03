import { TimerService, MessageService, HttpService } from "../Services/";
import { ChannelID } from "../Constants";
import client from "../CoronaBot";
import { MessageEmbed, TextChannel } from "discord.js";
import { ICountry, ICovidData } from '../Interfaces';
import {CountryCache} from '../Cache/Countries';

export class CovidHandler {

    public static async SendCovidInfoToChannel(): Promise<any> {

        const channel: TextChannel = (await (client.discordClient.channels.fetch(ChannelID.COVID_CHANNEL))) as TextChannel;

        if (!channel)
            return;

        try {
            const newCountryData: ICovidData = await HttpService.fetchCovidData();

              // Update cache only of new data is available
            if (newCountryData && newCountryData.Countries.length > 0)
                CountryCache.countries = newCountryData.Countries;
            
             
            var countryData: ICountry[] = CountryCache.countries
            var embedMessage: MessageEmbed = await MessageService.CreateMultiCountryMessage(countryData);

            channel.send({ embeds: [embedMessage] });


        } catch (ex) {
            console.log(ex);
            channel.send("An error occured in the send covid info to channel! Please fix it!")
        } finally {
            TimerService.rescheduleTimer(1, CovidHandler.SendCovidInfoToChannel, 10800000);
        }

    }

}