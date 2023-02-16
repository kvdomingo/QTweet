import { CmdFn } from ".";
import { DbChannel } from "../../db/channels";
import QChannel from "../QChannel/QChannel";
import { cmd } from "../master";
import { announcement } from "../post";

export const handleAnnounce = async ({ channels, msg }) => {
  const qChannelPromises = channels.map((channel: DbChannel) => {
    const qc = QChannel.unserialize(channel);
    return qc.obj();
  });
  const qChannelsObjs = await Promise.all(qChannelPromises);
  announcement(
    msg,
    channels.filter((c, index) => !!qChannelsObjs[index]),
  );
};

const announce: CmdFn = async ({ args }) => {
  const msg = args.join(" ");
  cmd("announce", { msg });
};

export default announce;
