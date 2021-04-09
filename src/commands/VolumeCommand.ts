import { BaseCommand } from "../structures/BaseCommand";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isUserInTheVoiceChannel, isMusicPlaying, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["a"],
    name: "a",
    description: "a",
    usage: "{prefix}a"
})
export class VolumeCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicPlaying()
    @isSameVoiceChannel()
    public execute(message: IMessage, args: string[]): any {
        let volume = Number(args[0]);

        if (isNaN(volume)) return message.channel.send(createEmbed("info", `📶 The current volume is ${message.guild!.queue!.volume.toString()}`).setTimestamp().setFooter(`Command Volume Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL()));

        if (volume < 0) volume = 0;
        if (volume === 0) return message.channel.send(createEmbed("warn", "❗ Please pause the music player instead of setting the volume to \`0\`").setTimestamp().setFooter(`Command Volume Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL()));
        if (Number(args[0]) > this.client.config.maxVolume) {
            return message.channel.send(
                createEmbed("warn", `❗ I can't set the volume above \`${this.client.config.maxVolume}\``).setTimestamp().setFooter(`Command Volume Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL())
            );
        }

        message.guild!.queue!.volume = Number(args[0]);
        message.guild!.queue!.connection?.dispatcher.setVolume(Number(args[0]) / this.client.config.maxVolume);
        message.channel.send(createEmbed("info", `📶 Volume set to ${args[0]}`).setTimestamp().setFooter(`Command Volume Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL())).catch(console.error);
    }
}
