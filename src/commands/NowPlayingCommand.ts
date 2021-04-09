import { BaseCommand } from "../structures/BaseCommand";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isMusicPlaying } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["a", "a"],
    name: "a",
    description: "a",
    usage: "{prefix}a"
})
export class NowPlayingCommand extends BaseCommand {
    @isMusicPlaying()
    public execute(message: IMessage): any {
        const song = message.guild?.queue?.songs.first();
        return message.channel.send(
            createEmbed("info", `${message.guild?.queue?.playing ? "▶ Now playing:" : "⏸ Now playing (paused):"} ` +
                `**[${song?.title as string}](${song?.url as string})**`)
                .setTimestamp()
                .setFooter(`Command NowPlaying Was Requested By: ${message.author.tag}`, message.author.displayAvatarURL())
                .setThumbnail(song?.thumbnail as string)
        );
    }
}
