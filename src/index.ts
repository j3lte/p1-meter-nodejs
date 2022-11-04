import Koa from "koa";
import { mqttTopic, serverPort } from "./env";
import { MQTT } from "./mqtt";
import { Parsed } from "./parser/Parsed";
import { startSerial } from "./serial";

const app = new Koa();

let isTimerEnabled = false;
let lastTimeStamp = 0;

console.log(`==== P1 Server listen on ${serverPort} ====`);

////////// SERIALPORT //////////
const parsed = new Parsed();
startSerial(parsed);

////////// APP //////////
app.use(async (ctx) => {
    ctx.status = 200;
    ctx.set("Content-Type", "application/json");
    ctx.body = {
        stack: parsed.stack,
        error: parsed.errorStack,
        last: parsed.lastUpdated,
        info: parsed.info,
    };
});

app.listen(serverPort);

////////// MQTT //////////
const mqtt = new MQTT();
setInterval(() => {
    if (
        !isTimerEnabled ||
        !mqtt.client ||
        !mqtt.client.connected ||
        parsed.info.ts === 0 ||
        parsed.info.ts === lastTimeStamp
    ) {
        return;
    }
    lastTimeStamp = parsed.info.ts;
    mqtt.publish(mqttTopic, parsed.dutchInfo);
}, 10000);

////////// TIMER //////////
setTimeout(() => {
    isTimerEnabled = true;
}, 10000);
