import { Message, MessageReaction } from "discord.js";

import { config } from "../Config";

const ACK_REACTIONS = ["👍", "🎮", "💚", "🍜"];
const EXPIRED_REACTIONS = ["🖤"];
const FAILURE_REACTIONS = ["⛔", "🚱"];

export class ReactionHandler {
  enableReactions: boolean;

  constructor(enableReactions: boolean) {
    this.enableReactions = enableReactions;
  }

  /** Indicates to the user that the command was executed successfully. */
  async success(message: Message): Promise<MessageReaction> {
    if (!this.enableReactions) return;

    return message.react(this.getRandom(ACK_REACTIONS));
  }

  /** Indicates to the user that the command failed for some reason. */
  async failure(message: Message): Promise<MessageReaction> {
    if (!this.enableReactions) return;

    await message.reactions.removeAll();
    return message.react(this.getRandom(FAILURE_REACTIONS));
  }

  /** Indicates to the user that the command is no longer active, as intended. */
  async expired(message: Message): Promise<MessageReaction> {
    if (!this.enableReactions) return;

    await message.reactions.removeAll();
    return message.react(this.getRandom(EXPIRED_REACTIONS));
  }

  /** Gets a random element of an array. */
  private getRandom(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}

export let reactor = new ReactionHandler(config.enableReactions);
