import { CmdFn } from ".";
import { getLang, setLang } from "../../db/guilds";
import log from "../../log";
import { FORMAT_POST_EMBEDS, formatLanguages } from "../format";
import { supportedLangs } from "../i18n";
import { embeds, translated } from "../post";

const lang: CmdFn = async ({ args }, qChannel) => {
  const verb = args.shift();
  switch (verb[0]) {
    case "l": {
      const gid = qChannel.guildId();
      const language = await getLang(gid);
      const res = await formatLanguages(qChannel.serialize(), supportedLangs, language);
      if (res.cmd === FORMAT_POST_EMBEDS) {
        embeds(qChannel, res.embeds);
      }
      break;
    }
    case "s": {
      const language = args.shift();
      if (!language) {
        translated(qChannel, "usage-lang-set");
        return;
      }
      if (supportedLangs.indexOf(language) === -1) {
        translated(qChannel, "noSuchLang", { language });
        return;
      }
      await setLang(qChannel.guildId(), language);
      translated(qChannel, "langSuccess");
      log(`Changed language to ${language}`, qChannel);
      break;
    }
    default:
      translated(qChannel, "invalidVerb", { verb });
  }
};

export default lang;
