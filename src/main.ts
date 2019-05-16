import * as discord from "discord.js"
import { UI } from "./ui";
import { WindowHandler as newUI } from "./windowHandler";
import readline from "readline"
import { EventEmitter } from "events";
import { token } from "./secret";

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)


interface KeyPress {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: false;
}
const sequenceEmitter = new EventEmitter();
process.stdin.on('keypress', (str, key: KeyPress) => {

    sequenceEmitter.emit(key.sequence)
    //console.log(key)
});
sequenceEmitter.on('\u0003', () => { //ctrl + c
    process.exit();
})

const client = new discord.Client()

client.on("ready", () => {
    const ui = new newUI(client.guilds);
    
    /*
    ui.init(client.guilds)

    sequenceEmitter.on('\u0011', () => {
        ui.nextGuild(1);
        ui.update();
    })
    sequenceEmitter.on('\u0017', () => {
        ui.nextChannel(-1);
        ui.update();
    })
    sequenceEmitter.on('\u0001', () => {
        ui.nextGuild(-1)
        ui.update();
    })
    sequenceEmitter.on('\u0013', () => {
        ui.nextChannel(1)
        ui.update();
    })
    sequenceEmitter.on('\u0005', () => {
        ui.addScroll(-1)
        ui.update();
    })
    sequenceEmitter.on('\u0004', () => {
        ui.addScroll(1)
        ui.update();
    })
    ui.update();
    */
})

client.login(token)

