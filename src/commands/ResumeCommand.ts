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
export class ResumeCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicPlaying()
    @isSameVoiceChannel()
    public execute(message: IMessage): any {
        if (message.guild?.queue?.playing) {
            message.channel.send(createEmbed("warn", "❗ The music player is not paused!").setTimestamp().setFooter(`Command Ping Was Requested by: ${message.author.tag}`, message.author.displayAvatarURL())).catch(e => this.client.logger.error("RESUME_CMD_ERR:", e));
        } else {
            message.guild!.queue!.playing = true;
            message.guild?.queue?.connection?.dispatcher.resume();
            message.channel.send(createEmbed("info", "▶ The music player resumed").setTimestamp().setFooter(`Command Ping Was Requested by: ${message.author.tag}`, message.author.displayAvatarURL())).catch(e => this.client.logger.error("RESUME_CMD_ERR:", e));
        }
    }
}
