import { ReadlineParser, SerialPort } from "serialport";
import { CODES } from "./parser/Codes";
import { Parsed } from "./parser/Parsed";

export const identify = (line: string, parsed: Parsed): void => {
    parsed.pushToStack(line);
    parsed.lastUpdated = new Date();
    const validLine = /\d-\d:.*/;
    const input = line.trim();

    if (!validLine.test(input)) {
        return;
    }

    const code = CODES.find((code) => input.startsWith(code.opCode));
    if (code) {
        const value = code.fix(input);
        if (code.parsedKey) {
            parsed.values[code.parsedKey] = value;
        }
    }
};

export const startSerial = async (parsed: Parsed) => {
    const ports = await SerialPort.list();
    const device = ports.find(
        (port) => port.vendorId === "0403" && port.productId === "6001"
    );

    if (!device) {
        console.log("Cannot find P1 port");
        return;
    }

    console.log(`==== Start P1 Serial Port (${device.path}) ====`);

    const port = new SerialPort({ path: device.path, baudRate: 115200 });
    const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.on("data", (data) => {
        identify(data, parsed);
    });

    parser.on("error", (err) => {
        parsed.pushToErrorStack(`${new Date()} :: ${err.message}`);
    });
};
