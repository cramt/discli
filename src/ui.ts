import * as discord from "discord.js"
import chalk from "chalk"

function clearConsole() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
}

const newLine = "\r\n"

export class UI {
    guilds: discord.Collection<string, discord.Guild>
    currentGuild = ""
    currentChannel: discord.Collection<string, string>
    scroll: discord.Collection<string, number>

    init(g: discord.Collection<string, discord.Guild>) {
        this.guilds = g.sort((a, b) => a.position - b.position)
        this.currentChannel = new discord.Collection<string, string>()
        let sortedGuilds = this.guilds.array().sort((a, b) => a.position - b.position);
        sortedGuilds.forEach(x => {

            if (x.defaultChannel === undefined) {
                this.currentChannel.set(x.id, x.channels.array().filter(x => x.type === "text")[0].id)
            }
            else {
                this.currentChannel.set(x.id, x.defaultChannel.id)
            }
        })
        this.scroll = new discord.Collection<string, number>()
        sortedGuilds.forEach(x => {
            this.scroll.set(x.id, 0)
        })
        this.currentGuild = this.guilds.firstKey()
    }

    nextGuild(index = 1) {
        let array = this.guilds.keyArray()
        let newIndex = array.indexOf(this.currentGuild) + index
        if (newIndex >= array.length) {
            newIndex = 0
        }
        if (newIndex < 0) {
            newIndex = array.length - 1
        }
        this.currentGuild = array[newIndex]
    }

    nextChannel(index = 1) {
        let guild = this.guilds.get(this.currentGuild)
        let channelId = this.currentChannel.get(guild.id)
        let array = guild.channels.array()
            .sort((a, b) => a.position - b.position)
            .filter(x => x.type == "text")
            .filter(x => x.memberPermissions(guild.me).has("READ_MESSAGES"))
            .map(x => x.id)
        let newIndex = array.indexOf(channelId) + index
        if (newIndex >= array.length) {
            newIndex = 0
        }
        if (newIndex < 0) {
            newIndex = array.length - 1
        }
        this.currentChannel.set(guild.id, array[newIndex])
    }

    addScroll(scroll = 0) {
        let id = this.guilds.get(this.currentGuild).id
        this.scroll.set(id, this.scroll.get(id) + scroll)
    }

    update() {
        clearConsole();
        const guild = this.guilds.get(this.currentGuild)
        let output: string[] = []
        output[output.length] = chalk.gray(guild.name) + "|" + newLine
        output[output.length] = chalk.gray(guild.name.split("").map(() => "-").join("") + "-") + newLine
        let textChannels = guild.channels.array()
            .sort((a, b) => a.position - b.position)
            .filter(x => x.type == "text")
            .filter(x => x.memberPermissions(guild.me).has("READ_MESSAGES"))
        let oldParentChannel: discord.CategoryChannel = null
        let currentChannel = guild.channels.get( this.currentChannel.get(guild.id))
        textChannels.forEach(x => {
            let prefix = ""
            if (x.parent !== null) {
                prefix += "\t"
                if (oldParentChannel === null || x.parent.id != oldParentChannel.id) {
                    output[output.length] = chalk.greenBright(x.parent.name) + newLine
                }
            }
            if (currentChannel.id == x.id) {
                output[output.length] = chalk.red(">")
            }
            oldParentChannel = x.parent
            output[output.length] = chalk.green(prefix + x.name) + newLine

        })
        let scroll = this.scroll.get(guild.id)
        if (scroll > 0) {
            for (let i = 0; i < scroll; i++) {
                output[output.length] = newLine
            }
        }
        if (scroll < 0) {
            let newScroll = output.length + scroll
            let newOutput: string[] = []
            for (let i = 0; i < newScroll; i++) {
                newOutput[newOutput.length] = output[newOutput.length]
            }
            output = newOutput
        }
        console.log(output.join(""))
    }
}