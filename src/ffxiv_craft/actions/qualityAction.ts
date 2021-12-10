import {Simulation} from "../simulation";
import {Buff} from "../buffs";
import {Action} from "./action";

export abstract class QualityAction extends Action {
    override apply(sim: Simulation) {
        let buffs = 1;
        if (sim.buffs[Buff.GREAT_STRIDES] > 0) {
            buffs += 1;
        }
        if (sim.buffs[Buff.INNOVATION] > 0) {
            buffs += .5;
        }
        if (sim.buffs[Buff.INNER_QUIET] > 0) {
            buffs *= 1 + sim.buffs[Buff.INNER_QUIET] * .1;
        }
        sim.removeBuff(Buff.GREAT_STRIDES);
        sim.quality += this.qualityAdded(sim, buffs);
        const iq_stacks: number = sim.hasBuff(Buff.INNER_QUIET) ? sim.buffs[Buff.INNER_QUIET] : 0;
        sim.buffs[Buff.INNER_QUIET] = Math.min(iq_stacks + this.iqStacksAdded(), 10);
        super.apply(sim);
    };
    override durabilityCost(): number {
        return 10;
    };
    qualityAdded(sim: Simulation, buffs: number): number {
        return Math.floor(sim.baseQuality() * this.getPotency(sim) / 100 * buffs);
    };
    iqStacksAdded(): number {
        return 1;
    };
    getPotency(sim: Simulation): number {
        return 100;
    };
}

