import Discord, { Message, Client, Intents } from "discord.js";
import { config } from "./Config";
import { IBotConfig } from "./Interfaces";
import { CommandHandler, GreetingHandler } from "./Handler";
import { TimerService } from "./Services";
import { INSPECT_MAX_BYTES } from "buffer";
import { CovidHandler } from './Handler';

class CoronaBot {
  public discordClient = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES], partials: ["MESSAGE", "CHANNEL"]
  });
  private commandHandler = new CommandHandler(config.prefix);
  private greetingHandler = new GreetingHandler();

  constructor() {
    this.validateConfig(config);
    this.startBackgroundTasks().then(async () => {
      await this.listen();
    });
  }

  /** Pre-startup validation of the bot config. */
  private validateConfig(config: IBotConfig): void {
    const token = config.token;
    if (!token)
      throw new Error("You need to specify your Discord bot token, base url and secret token!");
  }

  private async startBackgroundTasks(): Promise<void> {
    // await CronService.dstCheckCronJob();
    return;
  }
  
  private async setPresence(): Promise<void> {
    this.discordClient.user.setPresence(
      { activities: [{ name: "Covid tracking" }], status: "online" }
    );
  }

  private async listen(): Promise<void> {
    this.discordClient.on("ready", async () => {
      console.log("Corona Info bot is online!");
      const hourlyupdate = setTimeout(CovidHandler.SendCovidInfoToChannel, 10800000);

      TimerService.timers.set(1, hourlyupdate);
      this.setPresence();
    });


    this.discordClient.on("messageCreate", (message) => {
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
