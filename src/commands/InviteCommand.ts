import { BaseCommand } from "../structures/BaseCommand";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { createEmbed } from "../utils/createEmbed";
import { disableInviteCmd } from "../config";

@DefineCommand({
    aliases: ["web", "link"],
    name: "website",
    description: "Send the bot's website that contains its info and commands.",
    usage: "{prefix}website",
    disable: disableInviteCmd
})
export class InviteCommand extends BaseCommand {
    public async execute(message: IMessage): Promise<void> {
        message.channel.send(
            createEmbed("info")
                .setTimestamp()
                .setTitle(`PlayEX Discord Bot Website`)
                .setFooter(`Command Website Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL())
                .addField("PlayEX Discord Bot Website Link", `[Click here to open the website](https://example0365.000webhostapp.com/)`)
                .setColor("#000000")
        ).catch(e => this.client.logger.error("PLAY_CMD_ERR:", e));
    }
}
