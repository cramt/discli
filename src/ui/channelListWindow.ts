import { Window } from "./window";

export class ChannelListWindow extends Window {
    public wrapText = true;
    public generateText(): string[] {
        let guild = this.ui.guilds.get(this.ui.currentGuildId);
        if (guild === undefined) {
            guild = this.ui.guilds.first();
        }
        return guild.channels.sort((a, b) => a.position - b.position)
            .filter(x => x.type == "text")
            .filter(x => x.memberPermissions(guild.me).has("READ_MESSAGES")).array()
            .map(x => {
                return x.name;
            })
    }
}