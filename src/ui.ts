import * as discord from "discord.js"

function clearConsole() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
}

export class UI {
    guilds: discord.Guild[]
    currentGuildIndex = 0

    nextGuild(index = 1) {
        this.currentGuildIndex += index;
        if (this.currentGuildIndex >= this.guilds.length) {
            this.currentGuildIndex = 0
        }
        if (this.currentGuildIndex < 0) {
            this.currentGuildIndex = this.guilds.length - 1
        }
    }

    update() {
        clearConsole();
        console.log(this.guilds[this.currentGuildIndex].name)
    }
}