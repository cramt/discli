import { Window } from "./ui/window";
import { KeyValuePair } from "./utilities";
import * as discord from "discord.js"
import { ChannelListWindow } from "./ui/channelListWindow";
import { GuildWindow } from "./ui/guildWindow";

function emptyStringArrayOf(n: number) {
    let re: string[] = [];
    for (let i = 0; i < n; i++) {
        re[re.length] = "";
    }
    return re;
}

function emptyStringOf(n: number) {
    let re = "";
    for (let i = 0; i < n; i++) {
        re += " ";
    }
    return re;
}

export class WindowHandler {
    guilds: discord.Collection<string, discord.Guild>
    currentGuildId: string;
    height: number;
    width: number;
    createText(windows: Window[]) {
        let windowsAndText = windows.map(x => new KeyValuePair(x, x.generateText()))
        windowsAndText.map(x => {
            x.value = emptyStringArrayOf(x.key.xPosition).concat(x.value);
            while (x.value.length <= this.height) {
                x.value[x.value.length] = ""
            }
            if (x.value.length > this.height) {
                x.value = x.value.slice(0, this.height)
            }
            x.value = x.value.map(y => {
                let str = emptyStringOf(x.key.yPosition) + y;
                while (str.length <= this.width - 1) {
                    str += " ";
                }
                return str;
            })
            return x;
        })
        windowsAndText.sort((a, b) => {
            return a.key.yPosition - b.key.yPosition
        })
        let merged: string[] = [];
        windowsAndText.forEach((x, i) => {
            if (i == 0) {
                merged = x.value;
                return;
            }
            for (let i = 0; i < merged.length; i++) {
                merged[i] = merged[i].substring(0, x.key.yPosition) + x.value[i].substring(x.key.yPosition, x.value[i].length);
            }
        })
        merged.forEach(x => {
            console.log(x + "")
        })
    }
    constructor(g: discord.Collection<string, discord.Guild>) {
        this.guilds = g;
        this.width = process.stdout.columns;
        this.height = process.stdout.rows;
        let windows: Window[] = [new ChannelListWindow(), new GuildWindow()]
        windows.forEach(x => {
            x.ui = this;
        })
        windows[0].width = 10;
        windows[1].width = 10;
        windows[0].height = 10;
        windows[1].height = 10;
        windows[0].xPosition = 0;
        windows[1].xPosition = 0;
        windows[0].yPosition = 20;
        windows[1].yPosition = 10;
        this.createText(windows);
    }
    update() {

    }
}