import {Simulation} from "../simulation";
import {Buff} from "../buffs";
import {Action} from "./action";

export abstract class QualAction extends Action {
    override apply(sim: Simulation) {
        let buffs = 100;
        if (sim.buffs[Buff.GREAT_STRIDES] > 0) {
            buffs += 100;
        }
        if (sim.buffs[Buff.INNOVATION] > 0) {
            buffs += 50;
        }
        if (this.succeeded(sim)) {
            sim.removeBuff(Buff.GREAT_STRIDES);
            sim.quality += this.qualityAdded(sim, buffs);
            const iq_stacks: number = sim.buffs[Buff.INNER_QUIET];
            if (iq_stacks > 0) {
                sim.buffs[Buff.INNER_QUIET] = Math.min(iq_stacks + this.iqStacksAdded(), 11);
            }
        }
        super.apply(sim);
    };
    override durabilityCost(): number {
        return 10;
    };
    qualityAdded(sim: Simulation, buffs: number): number {
        return sim.calcQuality(this.getPotency(sim) * buffs / 100);
    };
    iqStacksAdded(): number {
        return 1;
    };
    getPotency(sim: Simulation): number {
        return 100;
    };
}

