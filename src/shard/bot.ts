import { init as initDb } from "../db/index";
import log from "../log";
import { getClient, init as initDiscord, login } from "./discord/discord";
import {
  handleChannelDelete,
  handleError,
  handleGuildCreate,
  handleGuildDelete,
  handleInteraction,
  handleMessage,
  handleReady,
} from "./discord/discordEvents";
import handleMasterMsg from "./handleMasterMsg";
import { init as initShard } from "./master";

process.on("unhandledRejection", err => {
  log("Unhandled exception:");
  log(err);
});

process.on("message", (msg: any) => {
  if (msg.cmd) {
    handleMasterMsg(msg);
  }
});

const start = async () => {
  // Init database
  log("⚙️  Initializing database...");
  initDb();
  // Init discord client
  log("⚙️  Creating Discord client...");
  initDiscord();
  initShard();
  // Register discord handles
  getClient()
    .on("message", handleMessage)
    .on("error", handleError)
    .on("guildCreate", handleGuildCreate)
    .on("guildDelete", handleGuildDelete)
    .on("ready", handleReady)
    .on("channelDelete", handleChannelDelete)
    .on("interactionCreate", handleInteraction);
  // Login
  login();
};

start();
