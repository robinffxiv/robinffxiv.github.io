import {Action} from "../action";
import {Buff} from "../../buffs";
import {Simulation} from "../../simulation";

export class DelicateSynthesis extends Action {
    override apply(sim: Simulation) {
        let progBuffs = 1;
        if (sim.buffs[Buff.MUSCLE_MEMORY] > 0) {
            progBuffs += 1;
        }
        if (sim.buffs[Buff.VENERATION] > 0) {
            progBuffs += .5;
        }
        let qualBuffs = 1;
        if (sim.buffs[Buff.GREAT_STRIDES] > 0) {
            qualBuffs += 1;
        }
        if (sim.buffs[Buff.INNOVATION] > 0) {
            qualBuffs += .5;
        }
        if (sim.buffs[Buff.INNER_QUIET] > 0) {
            qualBuffs *= 1 + sim.buffs[Buff.INNER_QUIET] * .1;
        }

        sim.removeBuff(Buff.MUSCLE_MEMORY);
        sim.progress += this.progressAdded(sim, progBuffs);

        sim.removeBuff(Buff.GREAT_STRIDES);
        sim.quality += this.qualityAdded(sim, qualBuffs);
        const iq_stacks: number = sim.hasBuff(Buff.INNER_QUIET) ? sim.buffs[Buff.INNER_QUIET] : 0;
        sim.buffs[Buff.INNER_QUIET] = Math.min(iq_stacks + this.iqStacksAdded(), 10);

        super.apply(sim);
    }
    progressAdded(sim: Simulation, buffs: number): number {
        return Math.floor(sim.baseProgress() * this.getPotency(sim) / 100 * buffs);
    };
    qualityAdded(sim: Simulation, buffs: number): number {
        return Math.floor(sim.baseQuality() * this.getPotency(sim) / 100 * buffs);
    };
    override durabilityCost(): number {
        return 10;
    };
    override cpCost(sim: Simulation): number {
        return 32;
    }
    getPotency(sim: Simulation): number {
        return 100;
    };
    iqStacksAdded() {
        return 1;
    };
    override getName(): string {
        return "Delicate Synthesis";
    }
}