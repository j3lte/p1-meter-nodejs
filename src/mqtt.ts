import mqtt from "mqtt";
import { mqttHost } from "./env";

export class MQTT {
    client: mqtt.MqttClient | null = null;

    constructor() {
        if (!mqttHost) {
            console.log(
                `==== MQTT not connected, please provide MQTT Host ====`
            );
            return;
        }
        const mqtthost = `mqtt://${mqttHost}:1883`;
        console.log(`==== Start MQTT (${mqtthost}) ====`);

        this.client = mqtt.connect(mqtthost, {
            reconnectPeriod: 15 * 1000,
            connectTimeout: 60 * 1000,
            keepalive: 60,
        });
        this.client.on("connect", () => {
            console.log("==== MQTT connected ====");
        });
        this.client.on("offline", () => {
            console.log("==== MQTT offline ====");
        });
        this.client.on("error", (e) => {
            console.log("==== MQTT error ====", e);
        });
        this.client.on("reconnect", () => {
            // console.log('MQTT reconnecting');
        });
    }

    publish(topic: string, object: unknown): void {
        if (!this.client) {
            return;
        }
        const msg = JSON.stringify(object);
        this.client.publish(topic, msg);
    }
}
