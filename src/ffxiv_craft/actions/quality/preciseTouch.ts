import {Simulation} from "../../simulation";
import {Condition} from "../../craft_util";
import {QualAction} from "../qualAction";

export class PreciseTouch extends QualAction {
    override getPotency(sim: Simulation): number {
        return 150;
    };

    override isUsable(sim: Simulation): boolean {
        return (sim.condition === Condition.GOOD || sim.condition === Condition.EXCELLENT) && super.isUsable(sim);
    };

    override cpCost(sim: Simulation): number {
        return 18;
    };

    override iqStacksAdded(): number {
        return 2;
    }

    override getName(): string {
        return "Precise Touch";
    }
}