import { BaseCommand } from "../structures/BaseCommand";
import { version } from "discord.js";
import { uptime as osUptime } from "os";
import path from "path";
import { formatMS } from "../utils/formatMS";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["botinfo", "info", "stats"],
    name: "about",
    description: "Send the bot's info/stats",
    usage: "{prefix}about"
})
export class AboutCommand extends BaseCommand {
    public async execute(message: IMessage): Promise<void> {
        const opusEncoderName = this.getOpusEncoder().name;
        message.channel.send(
            createEmbed("info", `
\`\`\`asciidoc
Cached users count  :: ${await this.client.getUsersCount()}
Channels count      :: ${await this.client.getChannelsCount()}
Guilds/\Server count :: ${await this.client.getGuildsCount()}
Shards count        :: ${this.client.shard ? `${this.client.shard.count}` : "N/A"}
Shard ID            :: ${this.client.shard ? `${this.client.shard.ids[0]}` : "N/A"}
Playing Music on    :: ${await this.client.getTotalPlaying()} guilds
YT Data Strategy    :: ${await this.client.config.YouTubeDataRetrievingStrategy === "api" ? "REST API" : "HTML SCRAPING"}

System Platform     :: ${process.platform}
Architecture        :: ${process.arch}
OS Uptime           :: ${formatMS(osUptime() * 1000)}
Memory              :: ${this.bytesToSize(await this.client.getTotalMemory("rss"))}
Process Uptime      :: ${formatMS(process.uptime() * 1000)}
Bot System Uptime   :: ${formatMS(this.client.uptime!)}

Node.js version     :: ${process.version}
Discord.js version  :: v${version}
FFMPEG version      :: v${(await import(this.getPackageJSON("ffmpeg-static")))["ffmpeg-static"]["binary-release-name"]}
YTDL-Core version   :: v${(await import(this.getPackageJSON("ytdl-core"))).version}
Opus Encoder        :: ${opusEncoderName} v${(await import(this.getPackageJSON(opusEncoderName))).version}
Bot System Version  :: v${(await import(path.resolve(process.cwd(), "package.json"))).version}
Bot Owned And Coded By :: Jingexz01✔#2841

Source code         :: https://github.com/Jingexz01/jukebox
\`\`\`
        `)
                .setFooter(`Command About Was Requested/\Executed By: ${message.author.tag}`, message.author.displayAvatarURL())
                .setTimestamp()
                .addField("Use >link for Jingexz01\'s Social Accounts.", "For Bot And Any Other Updates Check #\📣announcements on Jingexz01\'s Server")
                .addField("Discord Support Server/\Jingexz01\'s Server", `[Click here](https://discord.gg/DBHxxT7)`)
                .setAuthor(`${this.client.user?.username as string} - Just a simple Discord music bot. - About Command.`)
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
