import { ICommand } from "../Interfaces";
import { CommandContext } from "../Models";

export class GreetCommand implements ICommand {
  commandNames = ["greet", "hello"];

  getHelpMessage(commandPrefix: string): string {
    return `Use ${commandPrefix}greet to get a greeting.`;
  }

  async run(commandContext: CommandContext): Promise<void> {
    await commandContext.originalMessage.reply("hello, world!");
  }

  hasPermissionToRun(parsedUserCommand: CommandContext): boolean {
    return true;
  }
}
