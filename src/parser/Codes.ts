const parseValRegEx =
    /\d\-\d:\d{1,2}\.\d{1,2}\.\d{1,2}\(([\d.]+)\*(kW|V|kWh|A)\)/;
const parsedUnitLess = /\d\-\d:\d{1,2}\.\d{1,2}\.\d{1,2}\(([\d.]+)\)/;

export const defaultParser = (line: string) => {
    return parseFloat(line.replace(parseValRegEx, "$1"));
};
export const defaultParserUnitless = (line: string) => {
    return parseFloat(line.replace(parsedUnitLess, "$1"));
};
export const defaultParserUnitlessString = (line: string) => {
    return line.replace(parsedUnitLess, "$1");
};

export type CodeKey =
    | "p1"
    | "ts"
    | "pf"
    | "pf_long"
    | "vsg_1"
    | "vsg_2"
    | "vsw_1"
    | "vsw_2"
    | "ia_pp"
    | "ia_mp"
    | "t_1"
    | "t_2"
    | "d_1"
    | "d_2"
    | "delivery"
    | "received"
    | "tariff"
    | "current"
    | "voltage";

interface Code {
    opCode: string;
    identifier: string;
    unit?: string;
    fix: (line: string) => number;
    parsedKey?: CodeKey;
}

export const CODES: Code[] = [
    {
        opCode: "1-3:0.2.8",
        identifier: "P1 Version",
        fix: defaultParserUnitless,
        parsedKey: "p1",
    },
    {
        opCode: "0-0:1.0.0",
        identifier: "Timestamp",
        fix: (line) => {
            const timeStapStr = line.replace(
                /\d\-\d:\d{1,2}\.\d{1,2}\.\d{1,2}\(([\d.]+)(s|S)\)/,
                "$1"
            );
            const arr = timeStapStr.match(/.{1,2}/g);
            if (arr) {
                const [year, month, day, hour, minute, second] = arr;
                return new Date(
                    parseInt(year, 10) + 2000,
                    parseInt(month, 10) - 1,
                    parseInt(day, 10),
                    parseInt(hour, 10),
                    parseInt(minute, 10),
                    parseInt(second, 10)
                ).getTime();
            }
            return 0;
        },
        parsedKey: "ts",
    },
    // {
    //     opCode: "0-0:96.1.1",
    //     identifier: "Equipment ID",
    //     fix: defaultParserUnitlessString,
    // },
    {
        opCode: "0-0:96.7.21",
        identifier: "Powerfailures in any phase",
        fix: defaultParserUnitless,
        parsedKey: "pf",
    },
    {
        opCode: "0-0:96.7.9",
        identifier: "Long power failures in any phase",
        fix: defaultParserUnitless,
        parsedKey: "pf_long",
    },
    //   {
    //     opCode: "1-0:99.97.0",
    //     identifier: "Power Failure Event Log",
    //     fix: defaultParserUnitless, // Needs string
    //   },
    {
        opCode: "1-0:32.32",
        identifier: "Voltages sags in phase L1",
        fix: defaultParserUnitless,
        parsedKey: "vsg_1",
    },
    {
        opCode: "1-0:52.32",
        identifier: "Voltages sags in phase L2",
        fix: defaultParserUnitless,
        parsedKey: "vsg_2",
    },
    {
        opCode: "1-0:32.36",
        identifier: "Voltages swells in phase L1",
        fix: defaultParserUnitless,
        parsedKey: "vsw_1",
    },
    {
        opCode: "1-0:52.36",
        identifier: "Voltages swells in phase L2",
        fix: defaultParserUnitless,
        parsedKey: "vsw_2",
    },
    {
        opCode: "1-0:21.7.0",
        identifier: "Instantaneous active power L1 (+P) in W resolution",
        fix: defaultParser,
        parsedKey: "ia_pp",
    },
    {
        opCode: "1-0:22.7.0",
        identifier: "Instantaneous active power L1 (-P) in W resolution",
        fix: defaultParser,
        parsedKey: "ia_mp",
    },
    {
        opCode: "1-0:1.8.1",
        identifier:
            "Meter Reading electricity delivered to client (Tariff 1) in 0,001 kWh",
        unit: "kWh",
        fix: defaultParser,
        parsedKey: "t_1",
    },
    {
        opCode: "1-0:1.8.2",
        identifier:
            "Meter Reading electricity delivered to client (Tariff 2) in 0,001 kWh",
        unit: "kWh",
        fix: defaultParser,
        parsedKey: "t_2",
    },
    {
        opCode: "1-0:2.8.1",
        identifier:
            "Meter Reading electricity delivered by client (Tariff 1) in 0,001 kWh",
        unit: "kWh",
        fix: defaultParser,
        parsedKey: "d_1",
    },
    {
        opCode: "1-0:2.8.2",
        identifier:
            "Meter Reading electricity delivered by client (Tariff 2) in 0,001 kWh",
        unit: "kWh",
        fix: defaultParser,
        parsedKey: "d_2",
    },
    {
        opCode: "1-0:1.7.0",
        identifier:
            "Actual electricity power delivered (+P) in 1 Watt resolution",
        unit: "kW",
        fix: defaultParser,
        parsedKey: "delivery",
    },
    {
        opCode: "1-0:2.7.0",
        identifier:
            "Actual electricity power received (-P) in 1 Watt resolution",
        unit: "kW",
        fix: defaultParser,
        parsedKey: "received",
    },
    {
        opCode: "0-1:24.2.1",
        identifier: "Gas", // Not used
        unit: "kWh",
        fix: defaultParser,
    },
    {
        opCode: "0-0:96.14.0",
        identifier: "Tariff indicator electricity",
        fix: (line: string) => {
            return parseInt(line.replace(/0\-0:96\.14\.0\((\d+)\)/, "$1"));
        },
        parsedKey: "tariff",
    },
    {
        opCode: "1-0:31.7.0",
        identifier: "Instantaneous current L1 in A resolution.",
        unit: "A",
        fix: defaultParser,
        parsedKey: "current",
    },
    {
        opCode: "1-0:32.7.0",
        identifier: "Instantaneous voltage L1 in V resolution",
        unit: "V",
        fix: defaultParser,
        parsedKey: "voltage",
    },
];
