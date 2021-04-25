import { BaseCommand } from "../structures/BaseCommand";
import { version } from "discord.js";
import { uptime as osUptime } from "os";
import path from "path";
import { formatMS } from "../utils/formatMS";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["gamestatus", "gs", "game"],
    name: "Game Status",
    description: "Jing Private Server Status",
    usage: "{prefix}gamestats"
})
export class AboutCommand extends BaseCommand {
    public async execute(message: IMessage): Promise<void> {
        const opusEncoderName = this.getOpusEncoder().name;
        message.channel.send(
            createEmbed("info", `
\`\`\`asciidoc
System Memory Used         :: ${this.bytesToSize(await this.client.getTotalMemory("rss"))}
Current Players Playing    :: ${await this.client.getTotalPlaying()} Player
Game Process Uptime        :: ${formatMS(process.uptime() * 1000)}
Game Uptime                :: ${formatMS(this.client.uptime!)}
System Platform            :: ${process.platform}
Architecture               :: ${process.arch} (\Linux System\)
Operating System Uptime    :: ${formatMS(osUptime() * 1000)}
Discord Server Count       :: ${await this.client.getGuildsCount()} Bot Joined Servers
\`\`\`
        `)
                .setFooter(`Command GameStats Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp()
                .addField("Game Stats", "For Private Server Game And Any Other Updates Check #\📣announcements on Jingexz01\'s Server")
                .addField("Jing Private Server/\Jingexz01\'s Server", `[Click here](https://discord.gg/DBHxxT7)`)
                .setAuthor(`Jing Private Server - Game Status | Status : Online!`)
        ).catch(e => this.client.logger.error("ABOUT_CMD_ERR:", e));
    }

    private bytesToSize(bytes: number): string { // Function From Rendang's util (https://github.com/Hazmi35/rendang)
        if (isNaN(bytes) && bytes !== 0) throw new Error(`[bytesToSize] (bytes) Error: bytes is not a Number/Integer, received: ${typeof bytes}`);
        const sizes: string[] = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
        if (bytes < 2 && bytes > 0) return `${bytes} Byte`;
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
        if (i === 0) return `${bytes} ${sizes[i]}`;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (sizes[i] === undefined) return `${bytes} ${sizes[sizes.length - 1]}`;
        return `${Number(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }

    private getPackageJSON(pkgName: string): string {
        if (process.platform === "win32") pkgName = pkgName.replace("/", "\\");
        const resolvedPath = path.resolve(require.resolve(pkgName));
        return path.resolve(resolvedPath.split(pkgName)[0], pkgName, "package.json");
    }

    private getOpusEncoder(): any {
        const list = ["@discordjs/opus", "opusscript"];
        const errorLog = [];
        for (const name of list) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const data = require(name);
                data.name = name;
                return data;
            } catch (e) {
                errorLog.push(e);
            }
        }
        throw new Error(errorLog.join("\n"));
    }
}
