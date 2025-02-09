import { BaseCommand } from "../structures/BaseCommand";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isMusicPlaying } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["a"],
    name: "a",
    description: "a",
    usage: "{prefix}a"
})
export class QueueCommand extends BaseCommand {
    @isMusicPlaying()
    public execute(message: IMessage): any {
        const embed = createEmbed("info")
            .setTitle("Music Queue")
            .setTimestamp()
            .setFooter(`Command Queue Was Requested By: ${message.author.tag}`, message.author.displayAvatarURL())
            .setThumbnail(message.client.user?.avatarURL() as string);

        let num = 1;
        const songs = message.guild?.queue?.songs.map(s => `**${num++}.** **[${s.title}](${s.url})**`);
        if (Number(message.guild?.queue?.songs.size) > 12) {
            const indexes: string[] = this.chunk(songs!, 12);
            let index = 0;
            embed.setDescription(indexes[index]).setTimestamp().setFooter(`Page ${index + 1} of ${indexes.length}`, `Command Queue Was Requested By: ${message.author.tag}`);
            message.channel.send(embed).then(msg => {
                msg.react("◀️").then(() => {
                    msg.react("▶️").catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    msg.createReactionCollector((reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id, { time: 80 * 1000 }).on("collect", () => {
                        if (index === 0) return undefined;
                        index--;
                        embed.setDescription(indexes[index]).setTimestamp().setFooter(`Page ${index + 1} of ${indexes.length}`, `Command Queue Was Requested By: ${message.author.tag}`);
                        msg.edit(embed).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    });
                    msg.createReactionCollector((reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id, { time: 80 * 1000 }).on("collect", () => {
                        if (index + 1 === indexes.length) return undefined;
                        index++;
                        embed.setDescription(indexes[index]).setTimestamp().setFooter(`Page ${index + 1} of ${indexes.length}`, `Command Queue Was Requested By: ${message.author.tag}`);
                        msg.edit(embed).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
                    });
                }).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
            }).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
        } else {
            message.channel.send(embed.setTimestamp().setFooter(`Command Queue Was Requested By: ${message.author.tag}`, message.author.displayAvatarURL()).setDescription(songs!.join("\n"))).catch(e => this.client.logger.error("QUEUE_CMD_ERR:", e));
        }
    }

    private chunk(array: Array<any> | string, chunkSize: number): Array<any> {
        const temp = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            temp.push(array.slice(i, i + chunkSize));
        }
        return temp;
    }
}
