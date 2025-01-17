import { getLang } from "../../db/guilds";
import { getChannelSubs } from "../../db/subs";
import { FORMAT_POST_EMBEDS, formatSubsList } from "../format";
import { embeds, translated } from "../post";
import { SlashCommand } from "./types";
import { SlashCommandBuilder } from "@discordjs/builders";

const List: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription("Lists all the users whose tweets you're getting automatically in the current channel."),
  function: async ({ qc }) => {
    const gid = qc.guildId();
    const [subs, lan] = await Promise.all([getChannelSubs(qc.id, true), getLang(gid)]);
    const fmtResult = await formatSubsList(qc.serialize(), subs, lan);
    if (fmtResult.cmd === FORMAT_POST_EMBEDS) {
      const { embeds: pages } = fmtResult;
      embeds(qc, pages);
    } else {
      const { trCode } = fmtResult;
      translated(qc, trCode);
    }
  },
};

export default List;
