import { TimerService, MessageService, HttpService } from "../Services/";
import { ChannelID } from "../Constants";
import client from "../CoronaBot";
import { MessageEmbed, TextChannel } from "discord.js";

export class CovidHandler {

    public static async SendCovidInfoToChannel(): Promise<any> {
        var countryData = await HttpService.fetchCovidData();

        var embedMessage: MessageEmbed = await MessageService.CreateEmbdedMessage(countryData);

        const channel: TextChannel = (await (client.discordClient.channels.fetch(ChannelID.COVID_CHANNEL))) as TextChannel;

        if (!channel)
            return;

        channel.send({ embeds: [embedMessage] });

        TimerService.rescheduleTimer(1, CovidHandler.SendCovidInfoToChannel, 10800000);
    }

}