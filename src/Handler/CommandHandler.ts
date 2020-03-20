import { Message } from "discord.js";

import { ICommand } from "../Interfaces";
import { CommandContext } from "../Models";
import {
  GreetCommand,
  HelpCommand,
  CovidInfo,
} from "../Commands";
import { ChannelID } from "../Constants";

/** Handler for bot commands issued by users. */
export class CommandHandler {
  private commands: ICommand[];

  private allowedChannels: string[] = [];

  private readonly prefix: string;

  constructor(prefix: string) {
    const commandClasses = [
      // TODO: Add more commands here.
      new GreetCommand(),
      new CovidInfo(),
    ];

    this.commands = commandClasses;
    this.commands.push(new HelpCommand(this.commands));
    this.prefix = prefix;
  }

  /** Executes user commands contained in a message if appropriate. */
  async handleMessage(message: Message): Promise<void> {

    if (message.author.bot)
      return;

    if (message.channel.type !== "dm")
      if (!this.isAllowedChannel(message))
        return;

    // if (this.isAllowedKeyword(message)) {
    //   message.content = this.prefix + message.content;
    // }

    if (!this.isCommand(message))
      return;

    const commandContext = new CommandContext(message, this.prefix);

    const allowedCommands = this.commands.filter(command => command.hasPermissionToRun(commandContext));
    const matchedCommand = this.commands.find(command => command.commandNames.includes(commandContext.parsedCommandName));

    if (!matchedCommand)
      await message.reply(`I don't recognize that command. Try !help.`);
    // await reactor.failure(message);
    else if (!allowedCommands.includes(matchedCommand))
      await message.reply(`you aren't allowed to use that command. Try !help.`);
    // await reactor.failure(message);
    else
      await matchedCommand.run(commandContext);
    /*   await matchedCommand.run(commandContext).then(() => {
        reactor.success(message);
      }).catch(reason => {
        reactor.failure(message);
      }); */

  }

  /** Determines whether or not a message is a user command. */
  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }

  private isAllowedKeyword(message: Message): boolean {
    const allowedKeywords = [
      "release",
    ];

    for (const key of allowedKeywords)
      if (message.content.includes(key))
        return true;



    return false;
  }

  private isAllowedChannel(message: Message): boolean {
    const channelID: string = message.channel.id;
    for (const id of this.allowedChannels)
      if (id === channelID)
        return true;


    return false;
  }
}
