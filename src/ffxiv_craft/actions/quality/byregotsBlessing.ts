import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {QualAction} from "../qualAction";

export class ByregotsBlessing extends QualAction {
    override isUsable(sim: Simulation): boolean {
        return sim.hasBuff(Buff.INNER_QUIET) && super.isUsable(sim);
    };

    override getPotency(sim: Simulation): number {
        const stacks = sim.buffs[Buff.INNER_QUIET];
        return stacks > 0 ? stacks * 20 + 80 : 100;
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