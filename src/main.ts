import * as discord from "discord.js"
import { UI } from "./ui";
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
    //console.log(key)
    sequenceEmitter.emit(key.sequence)
});
sequenceEmitter.on('\u0003', () => { //ctrl + c
    process.exit();
})

const client = new discord.Client()

const ui = new UI();

client.on("ready", () => {
    console.log("hey boi")
    console.log(client.guilds.size)
    ui.guilds = client.guilds.array().sort((a, b) => a.position - b.position);
    sequenceEmitter.on('\u0011', ()=>{
        ui.nextGuild();
        ui.update();
    })
    sequenceEmitter.on('\u0005', ()=>{
        ui.nextGuild(-1);
        ui.update();
    })
    ui.update();
})

client.login(token)

