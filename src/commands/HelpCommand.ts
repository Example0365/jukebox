import { BaseCommand } from "../structures/BaseCommand";
import { MessageEmbed } from "discord.js";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["a", "a"],
    name: "a",
    description: "a",
    usage: "{prefix}a"
})
export class HelpCommand extends BaseCommand {
    public execute(message: IMessage, args: string[]): void {
        const command = message.client.commands.get(args[0]) ??
            message.client.commands.get(message.client.commands.aliases.get(args[0])!);
        if (command && !command.meta.disable) {
            message.channel.send(
                new MessageEmbed()
                    .setTitle(`Information for the ${command.meta.name} command`)
                    .setThumbnail("https://raw.githubusercontent.com/Hazmi35/jukebox/main/.github/images/question_mark.png")
                    .setTimestamp()
                    .setFooter(`Command Help Was Requested/\Executed by: ${message.author.tag}`, message.author.displayAvatarURL())
                    .addFields({ name: "Name", value: `\`${command.meta.name}\``, inline: true },
                        { name: "Description", value: command.meta.description, inline: true },
                        { name: "Aliases", value: `${Number(command.meta.aliases?.length) > 0 ? command.meta.aliases?.map(c => `\`${c}\``).join(", ") as string : "None."}`, inline: true },
                        { name: "Usage", value: `\`${command.meta.usage?.replace(/{prefix}/g, message.client.config.prefix) as string}\``, inline: false })
                    .setColor("#00FF00")
            ).catch(e => this.client.logger.error("HELP_CMD_ERR:", e));
        } else {
            message.channel.send(
                createEmbed("info", message.client.commands.filter(cmd => !cmd.meta.disable && cmd.meta.name !== "eval").map(c => `\`${c.meta.name}\``).join(" "))
                    .setTitle("Help Menu")
                    .setColor("#00FF00")
                    .setTimestamp()
                    .setThumbnail(message.client.user?.displayAvatarURL() as string)
                    .addField(`Use ${message.client.config.prefix}help <command> to get more info on a specific command!`, "PlayEX - 2021")
                    .setFooter(`Command Help Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL())
            ).catch(e => this.client.logger.error("HELP_CMD_ERR:", e));
        }
    }
}
