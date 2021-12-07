import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {QualityAction} from "../qualityAction";

export class ByregotsBlessing extends QualityAction {
    override isUsable(sim: Simulation): boolean {
        return sim.buffs[Buff.INNER_QUIET] >= 2 && super.isUsable(sim);
    };

    override getPotency(sim: Simulation): number {
        return 100 + sim.buffs[Buff.INNER_QUIET] * 20;
    };

    override cpCost(sim: Simulation): number {
        return 24;
    };

    override buffApplied(): [Buff, number] | undefined {
        return [Buff.INNER_QUIET, 0];
    };

    override getName(): string {
        return "Byregot's Blessing";
    }
}