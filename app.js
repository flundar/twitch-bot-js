const fs = require("fs");
const tmi = require("tmi.js");
const logger = require("tmi.js/lib/logger");

const config = JSON.parse(fs.readFileSync("app.cfg.json"));
let commands = JSON.parse(fs.readFileSync(config.commands));
let viewers = [];
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let client = new tmi.Client({
    identity: {
        username: config.username,
        password: config.password
    },
    channels: [config.channel],
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        secure: true
    }
});

client.connect();





process.on("SIGINT", () => {
    client.disconnect()
        .then(() => {
            fs.writeFileSync(
                config.commands,
                JSON.stringify(commands.sort((a, b) => {
                    if (a.name < b.name) { return -1; }
                    else if (a.name > b.name) { return 1; }
                    else { return 0; }
                }), null, 4) + "\n",
                () => {
                    logger.warn(`Could not save commands to ${config.commands}!`);
                }
            );

            process.exit();
        });
});

client.on("subscribers", (channel, enabled) => {
    if (enabled == true){
        client.say(channel, `Görüşürüz pleb kardeşlerim...`);
    }
    if (enabled == false){
        client.say(channel, `Hoş geldiniz pleb kardeşlerim...`);
    }
});

client.on("whisper", (from, userstate, message, self) => {
    // Don't listen to my own messages..
    if (self) return;

   
});

client.on("ban", (channel, username, reason, userstate) => {


  
});

client.on("clearchat", (channel) => {
    client.say(channel, `Temiz bir chat herşeye bedel..`);
});

client.on("hosted", (channel, username, viewers, autohost) => {
    if (viewers > 30){
        client.say(channel, `${username} kanalı bizi ${viewers} kişiyle hostladı!`);
    }
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    client.say(channel, `@${username} ${cumulativeMonths} aydır aboneliğini yeniliyor teşekkürler!`);
});

client.on("slowmode", (channel, enabled, length) => {
    client.say(channel, `LA YAVAŞ YAVAŞ İLLA  SLOWMODE AÇTIRCANIZ`);
});

client.on("subgift", (channel, hediyeci, streakMonths, hediyealan, methods, userstate) => {
    client.say(channel, `@${hediyeci}  @${hediyealan} adlı kişiye abonelik hediye etti, hayırlı olsun!`);
});

client.on("subscription", (channel, user, method, message, userstate) => {
    client.say(channel, `Aramıza hoş geldin! @${user} `);
});


client.on("chat", (channel, userstate, commandMessage, self) => {
    if (self) { return; };
    if (!config.verbose) { return; };
    if (commandMessage === ("cordaysepsbot")) { 
    client.say(channel, `@${userstate.username} valla bilmiyorum ne diyorlar ?`);
    }
    // if (commandMessage === ("SA")) { 
    //     client.say(channel, `@${userstate.username} Aleyküm selam GaRDaŞş, hoşgeldin!`);
    // };
    // if (commandMessage === ("sa")) { 
    //     client.say(channel, `@${userstate.username} Aleyküm selam GaRDaŞş, hoşgeldin!`);
    // };
});
