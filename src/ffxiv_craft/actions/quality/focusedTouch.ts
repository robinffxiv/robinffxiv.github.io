import {Simulation} from "../../simulation";
import {Observe} from "../other/observe";
import {QualAction} from "../qualAction";

export class FocusedTouch extends QualAction {
    override getPotency(sim: Simulation): number {
        return 150;
    };

    override cpCost(sim: Simulation): number {
        return 18;
    };

    override successRate(sim: Simulation): number {
        return sim.lastAction() === new Observe().getName() ? 1 : 0.5;
    };

    canFail(): boolean {
        return true;
    }

    override getName(): string {
        return "Focused Touch";
    }
}