export const mqttHost = process.env.MQTT_HOST || "mqtt";
export const mqttTopic = process.env.MQTT_TOPIC || "energy";
export const ignoreTS = process.env.IGNORE_TS || "false";

export const tarieven = {
    normaal: process.env.TARIEF_NORMAAL
        ? parseFloat(process.env.TARIEF_NORMAAL)
        : 0,
    dal: process.env.TARIEF_DAL ? parseFloat(process.env.TARIEF_DAL) : 0,
};

export const serverPort = process.env.SERVER_PORT
    ? parseInt(process.env.SERVER_PORT)
    : 3000;

// LOCAL DEV

// export const mqttHost: string | null = "home.local";
// export const mqttTopic: string = "energy";
