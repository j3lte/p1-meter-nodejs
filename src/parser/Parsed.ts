import { tarieven } from "../env";
import { CodeKey } from "./Codes";

export type ParsedValues = {
    [key in CodeKey]: number;
};

export class Parsed {
    maxLen = 200;
    stack: string[] = [];
    errorStack: string[] = [];
    lastUpdated: Date | null = null;
    values: ParsedValues = {
        p1: 0,
        ts: 0,
        pf: 0,
        pf_long: 0,
        vsg_1: 0,
        vsg_2: 0,
        vsw_1: 0,
        vsw_2: 0,
        ia_pp: 0,
        ia_mp: 0,
        t_1: 0,
        t_2: 0,
        d_1: 0,
        d_2: 0,
        delivery: 0,
        received: 0,
        tariff: 0,
        current: 0,
        voltage: 0,
    };

    constructor(maxLen = 200) {
        this.maxLen = maxLen;
    }

    pushToStack(line?: string): void {
        if (!line) {
            return;
        }
        this.stack.push(line);
        if (this.stack.length > this.maxLen) {
            this.stack.shift();
        }
    }

    pushToErrorStack(line?: string): void {
        if (!line) {
            return;
        }
        this.errorStack.push(line);
        if (this.errorStack.length > this.maxLen) {
            this.errorStack.shift();
        }
    }

    calculateCurrent(): number {
        return (
            this.values.delivery *
            (this.values.tariff === 2 ? tarieven.normaal : tarieven.dal)
        );
    }

    get info() {
        return {
            ...this.values,
            cost: this.calculateCurrent(),
        };
    }

    get dutchInfo() {
        const {
            ts,
            t_1,
            t_2,
            delivery,
            tariff,
            current,
            voltage,
            pf,
            pf_long,
        } = this.values;
        return {
            time: `${ts}`,
            dal: t_1,
            piek: t_2,
            huidig: delivery,
            tarief: tariff,
            power: {
                voltage,
                current,
                pf,
                pf_long,
            },
            cost: this.calculateCurrent(),
        };
    }
}
