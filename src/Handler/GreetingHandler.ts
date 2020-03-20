/** Handler for bot commands issued by users. */
import { GuildMember, RichEmbed } from "discord.js";

import { Colors } from "../Constants";

export class GreetingHandler {

    public async handleGreeting(member: GuildMember) {
        const embedMessage = new RichEmbed();

        embedMessage.setColor(Colors.CYAN);
        embedMessage.setTitle("__**Undying WoW - Welcome:**__");
        embedMessage.setTimestamp(new Date());
        embedMessage.setDescription("Welcome to Undying Wow\n\n" +
            "We are glad you found your way to us.\nBefore participating we'd like you to read our rules in #rules!\n" +
            "once you're ready tick the :white_check_mark:!\n Easy as that!");

        member.send({
            embed: embedMessage,
        });
    }
}
