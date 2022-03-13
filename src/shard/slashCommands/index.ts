import { Client, SlashCommand } from '../discord/clientType';
import announce from './announce'
import lang from './lang'
import list from './list'
import qtprefix from './qtprefix'
import start from './start'
import stop from './stop'
import stopchannel from './stopchannel'
import tweet from './tweet'
import tweetId from './tweetId'
import help from './help'

const commands : SlashCommand[] = [
  announce,
  lang,
  list,
  qtprefix,
  start,
  stop,
  stopchannel,
  tweet,
  tweetId,
  help
]

export default (client: Client) => {
  for (const command of commands) {
    client.slashCommands.set(command.data.name, command);
  }
};
