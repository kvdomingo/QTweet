import { CmdFn } from ".";
import log from "../../log";
import QChannel from "../QChannel/QChannel";
import { cmd } from "../master";
import { embed as postEmbed } from "../post";

export const handleTweetId = async ({ qc, res: { formatted, isQuoted, quoted }, msg: { id } }) => {
  const qChannel = QChannel.unserialize(qc);

  const { embed } = formatted;
  postEmbed(qChannel, embed);
  log(`Posting tweet ${id}`, qChannel);

  if (isQuoted) {
    const { embed: quotedEmbed } = quoted;
    postEmbed(qChannel, quotedEmbed);
  }
};

const tweetId: CmdFn = ({ args: [id] }, qChannel) => {
  cmd("tweetId", { id, qc: qChannel.serialize() });
};

export default tweetId;
