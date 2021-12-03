import {SynthAction} from "../synthAction";
import {Simulation} from "../../simulation";

export class RapidSynthesis extends SynthAction {
    override getPotency(sim: Simulation): number {
        return 500;
    };

    override successRate(): number {
        return .5;
    };

    canFail(): boolean {
        return true;
    }

    override getName(): string {
        return "Rapid Synthesis";
    }
}