import { Window } from "./window";

export class GuildWindow extends Window {
    public wrapText = true;
    public generateText(): string[] {
        let guilds = this.ui.guilds.array()
        guilds.sort((a, b) => {
            return a.position - b.position;
        })
        return guilds.map(x => {
            return x.nameAcronym;
        });
    }
}