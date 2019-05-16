import { WindowHandler } from "../windowHandler";

export abstract class Window {
    public ui: WindowHandler;
    public abstract wrapText: boolean;
    public height: number;
    public width: number;
    public xPosition: number;
    public yPosition: number;
    public abstract generateText(): string[];
    public scrollbar: number = 0;
    public scroll(index: number){
        this.scrollbar += index;
    }
}