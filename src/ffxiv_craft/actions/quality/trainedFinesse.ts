import {Simulation} from "../../simulation";
import {QualityAction} from "../qualityAction";
import {Buff} from "../../buffs";

export class TrainedFinesse extends QualityAction {
    override getPotency(sim: Simulation): number {
        return 100;
    };

    override cpCost(sim: Simulation): number {
        return 32;
    };

    override durabilityCost(): number {
        return 0;
    }

    override isUsable(sim: Simulation): boolean {
        return sim.buffs[Buff.INNER_QUIET] === 10 && super.isUsable(sim);
    }

    override getName(): string {
        return "Advanced Touch";
    }
}