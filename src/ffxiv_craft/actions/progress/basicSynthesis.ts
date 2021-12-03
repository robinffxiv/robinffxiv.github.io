import {SynthAction} from "../synthAction";
import {Simulation} from "../../simulation";

export class BasicSynthesis extends SynthAction {
    override getPotency(sim: Simulation): number {
        return 120;
    };

    override getName(): string {
        return "Basic Synthesis";
    }
}