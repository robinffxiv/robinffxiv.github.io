import {Simulation} from "../../simulation";
import {Observe} from "../other/observe";
import {QualityAction} from "../qualityAction";

export class FocusedTouch extends QualityAction {
    override getPotency(sim: Simulation): number {
        return 150;
    };

    override cpCost(sim: Simulation): number {
        return 18;
    };

    override isUsable(sim: Simulation): boolean {
        return sim.lastAction() === new Observe().getName() && super.isUsable(sim);
    }

    override getName(): string {
        return "Focused Touch";
    }
}