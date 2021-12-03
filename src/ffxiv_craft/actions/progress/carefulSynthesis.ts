import {SynthAction} from "../synthAction";
import {Simulation} from "../../simulation";

export class CarefulSynthesis extends SynthAction {
    override getPotency(sim: Simulation): number {
        return 150;
    };

    override cpCost(sim: Simulation): number {
        return 7;
    };

    override getName(): string {
        return "Careful Synthesis";
    }
}