import { TimerService, MessageService, HttpService } from "../Services/";
import { ChannelID } from "../Constants";
import client from "../CoronaBot";
import { MessageEmbed, TextChannel } from "discord.js";
import { ICountry } from '../Interfaces';
import { channel } from "diagnostics_channel";

export class CovidHandler {

    public static async SendCovidInfoToChannel(): Promise<any> {

        const channel: TextChannel = (await (client.discordClient.channels.fetch(ChannelID.COVID_CHANNEL))) as TextChannel;

        if (!channel)
            return;

        try {
            var countryData: ICountry[] = await HttpService.fetchCovidData();
            var embedMessage: MessageEmbed = await MessageService.CreateMultiCountryMessage(countryData);

            channel.send({ embeds: [embedMessage] });


        } catch (ex) {
            channel.send("An error occured! Please fix it!")
        } finally {
            TimerService.rescheduleTimer(1, CovidHandler.SendCovidInfoToChannel, 10800000);
        }

    }

}