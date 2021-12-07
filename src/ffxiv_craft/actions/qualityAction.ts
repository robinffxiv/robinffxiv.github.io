import {Simulation} from "../simulation";
import {Buff} from "../buffs";
import {Action} from "./action";

export abstract class QualityAction extends Action {
    override apply(sim: Simulation) {
        let buffs = 100;
        if (sim.buffs[Buff.GREAT_STRIDES] > 0) {
            buffs += 100;
        }
        if (sim.buffs[Buff.INNOVATION] > 0) {
            buffs += 50;
        }
        sim.removeBuff(Buff.GREAT_STRIDES);
        sim.quality += Math.floor(this.qualityAdded(sim, buffs));
        const iq_stacks: number = sim.hasBuff(Buff.INNER_QUIET) ? sim.buffs[Buff.INNER_QUIET] : 0;
        sim.buffs[Buff.INNER_QUIET] = Math.min(iq_stacks + this.iqStacksAdded(), 10);
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

