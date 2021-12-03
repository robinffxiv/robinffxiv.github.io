import {Simulation} from "../../simulation";
import {SynthAction} from "../synthAction";
import {Observe} from "../other/observe";

export class FocusedSynthesis extends SynthAction {
    override getPotency(sim: Simulation): number {
        return 200;
    };

    override successRate(sim: Simulation): number {
        return sim.lastAction() ===  new Observe().getName() ? 1 : 0.5;
    };

    override canFail(): boolean {
        return true;
    }

    override getName(): string {
        return "Focused Synthesis";
    }
}