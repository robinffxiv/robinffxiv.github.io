import {Simulation} from "../../simulation";
import {ProgressAction} from "../progressAction";
import {Observe} from "../other/observe";

export class FocusedSynthesis extends ProgressAction {
    override getPotency(sim: Simulation): number {
        return 200;
    };

    override cpCost(sim: Simulation): number {
        return 5;
    }

    override isUsable(sim: Simulation): boolean {
        return sim.lastAction() === new Observe().getName() && super.isUsable(sim);
    }


    override getName(): string {
        return "Focused Synthesis";
    }
}