import { rmChannel } from "../../db/channels";
import { getChannelSubs } from "../../db/subs";
import log from "../../log";
import QChannel, { isQCSupportedChannel } from "../QChannel/QChannel";
import { isChannelMod } from "../commands/checks";
import { translated } from "../post";
import { SlashCommand } from "./types";
import { SlashCommandBuilder } from "@discordjs/builders";

const StopChannel: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("stopchannel")
    .setDescription("Acts like /stop but on the whole channel.")
    .addStringOption(option =>
      option.setName("channelid").setDescription("The channel ID to stop posts").setRequired(false),
    ),

  function: async ({ qc, interaction }) => {
    const isMod = await isChannelMod(interaction.user, qc);
    if (!isMod) {
      translated(qc, "stopForMods");
      log('Rejected command "stop" with reason: stopForMods');
      return;
    }
    let targetChannel = qc.id;
    let channelName = await qc.name();
    const channelIdArg = interaction.options.getString("channelIid");

    if (!!channelIdArg) {
      if (qc.isDM) {
        translated(qc, "stopChannelInDm");
        return;
      }
      const guild = await qc.guild();
      targetChannel = channelIdArg;
      const channelObj = guild.channels.cache.find(c => c.id === channelIdArg);
      if (!channelObj || !isQCSupportedChannel(channelObj)) {
        translated(qc, "noSuchChannel", { targetChannel });
        return;
      }
      channelName = await new QChannel(channelObj).name();
    }
    const subs = await getChannelSubs(targetChannel);
    await rmChannel(targetChannel);
    log(`Removed all gets from channel ID:${targetChannel}. ${subs.length} subs removed.`, qc);
    translated(qc, "stopChannelSuccess", { subs: subs.length, channelName });
  },
};

export default StopChannel;
