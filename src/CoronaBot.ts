import Discord, { Message, TextChannel } from "discord.js";
import { config } from "./Config";
import { IBotConfig } from "./Interfaces";
import { CommandHandler, GreetingHandler } from "./Handler";
import { HttpService, TimerService } from "./Services";
import { CovidInfos } from "./Services/CovidInfos";

class CoronaBot {
  public discordClient = new Discord.Client();
  private commandHandler = new CommandHandler(config.prefix);
  private greetingHandler = new GreetingHandler();

  constructor() {
    this.validateConfig(config);
    this.startBackgroundTasks().then(() => {
      this.listen();
    });
  }

  /** Pre-startup validation of the bot config. */
  private validateConfig(config: IBotConfig): void {
    const { baseUrl, token } = config;
    if (!token || !baseUrl)
      throw new Error("You need to specify your Discord bot token, base url and secret token!");
  }

  private async startBackgroundTasks(): Promise<void> {
    // await CronService.dstCheckCronJob();
    return;
  }


  private async setPresence(): Promise<void> {
    this.discordClient.user.setPresence({
      game: {
        name: "Test bot",
        url: "WATCHING"
      },
      status: "online"
    });
  }

  private async listen(): Promise<void> {
    this.discordClient.on("ready", async () => {
      console.log("Corona Info bot is online!");
      const hourlyupdate = setTimeout(CovidInfos.getInfos, 10800000);

      TimerService.timers.set(1, hourlyupdate);
    });


    this.discordClient.on("message", (message: Message) => {
      this.commandHandler.handleMessage(message);
    });


    this.discordClient.on("error", e => {
      console.error("Discord client error!", e);
    });

    /*this.discordClient.on("guildMemberAdd", member => {
      this.greetingHandler.handleGreeting(member);
    }); */

    this.discordClient.login(config.token);
  }
}

const client = new CoronaBot();
export default client;
