import { BaseCommand } from "../structures/BaseCommand";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isUserInTheVoiceChannel, isMusicPlaying, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    name: "a",
    description: "a",
    usage: "{prefix}a"
})
export class PauseCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicPlaying()
    @isSameVoiceChannel()
    public execute(message: IMessage): any {
        if (message.guild?.queue?.playing) {
            message.guild.queue.playing = false;
            message.guild.queue.connection?.dispatcher.pause();
            return message.channel.send(createEmbed("info", "⏸ Paused the music for you!")
                .setTimestamp()
                .setFooter(`Command Pause Was Requested By: ${message.author.tag}`, message.author.displayAvatarURL()));
        }
        message.channel.send(createEmbed("warn", "❗ Music is already paused!")
            .setTimestamp()
            .setFooter(`Command Pause Was Requested By: ${message.author.tag}`, message.author.displayAvatarURL()))
            .catch(e => this.client.logger.error("PAUSE_CMD_ERR:", e));
    }
}
