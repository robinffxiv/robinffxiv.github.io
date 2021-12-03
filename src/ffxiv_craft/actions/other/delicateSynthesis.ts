import {Action} from "../action";
import {Buff} from "../../buffs";
import {Simulation} from "../../simulation";

export class DelicateSynthesis extends Action {
    override apply(sim: Simulation) {
        let progBuffs = 100;
        if (sim.buffs[Buff.MUSCLE_MEMORY] > 0) {
            progBuffs += 100;
        }
        if (sim.buffs[Buff.VENERATION] > 0) {
            progBuffs += 50;
        }
        let qualBuffs = 100;
        if (sim.buffs[Buff.GREAT_STRIDES] > 0) {
            qualBuffs += 100;
        }
        if (sim.buffs[Buff.INNOVATION] > 0) {
            qualBuffs += 50;
        }
        if (this.succeeded(sim)) {
            sim.removeBuff(Buff.MUSCLE_MEMORY);
            sim.progress += this.progressAdded(sim, progBuffs);
            sim.removeBuff(Buff.GREAT_STRIDES);
            sim.quality += this.qualityAdded(sim, qualBuffs);
            const iq_stacks: number = sim.buffs[Buff.INNER_QUIET];
            if (iq_stacks > 0) {
                sim.buffs[Buff.INNER_QUIET] = Math.min(iq_stacks + this.iqStacksAdded(), 11);
            }
        }
        if (sim.buffs[Buff.FINAL_APPRAISAL] > 0) {
            sim.progress = Math.min(sim.progress, sim.recipe.progress - 1);
        }
        super.apply(sim);
    }
    progressAdded(sim: Simulation, buffs: number): number {
        return sim.calcProgress(this.getPotency() * buffs / 100);
    };
    qualityAdded(sim: Simulation, buffs: number): number {
        return sim.calcQuality(this.getPotency(sim) * buffs / 100);
    };
    override durabilityCost(): number {
        return 10;
    };
    override cpCost(sim: Simulation): number {
        return 32;
    }
    getPotency(sim?: Simulation): number {
        return 100;
    };
    iqStacksAdded() {
        return 1;
    };
    override getName(): string {
        return "Delicate Synthesis";
    }
}