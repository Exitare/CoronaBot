export interface IBotConfig {
    /** the Discord bot token. */
    token: string;
    /** Prefix used for bot commands. */
    prefix: string;
    /** The name of the role that gives ultimate power over the bot. */
    botOwnerRoleName: string;
    /** The bot will add reactions to the command messages indicating success or failure. */
    enableReactions: boolean;
     /** The default embed color */
     color: number;
    /** The url the bot will send requests to */
    baseUrl: string;
}
