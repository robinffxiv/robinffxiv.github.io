import {Simulation} from "../../simulation";
import {Condition} from "../../craft_util";
import {SynthAction} from "../synthAction";

export class IntensiveSynthesis extends SynthAction {
    override getPotency(sim: Simulation): number {
        return 400;
    };

    override isUsable(sim: Simulation): boolean {
        return (sim.condition === Condition.GOOD || sim.condition === Condition.EXCELLENT) && super.isUsable(sim);
    };

    override getName(): string {
        return "Intensive Synthesis";
    }
}