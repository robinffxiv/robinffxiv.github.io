import {Simulation} from "../simulation";
import {Buff} from "../buffs";
import {Action} from "./action";

export abstract class SynthAction extends Action {
    override apply(sim: Simulation): void {
        let buffs = 100;
        if (sim.buffs[Buff.MUSCLE_MEMORY] > 0) {
            buffs += 100;
        }
        if (sim.buffs[Buff.VENERATION] > 0) {
            buffs += 50;
        }
        if (this.succeeded(sim)) {
            sim.removeBuff(Buff.MUSCLE_MEMORY);
            sim.progress += this.progressAdded(sim, buffs);
        }
        if (sim.buffs[Buff.FINAL_APPRAISAL] > 0) {
            sim.progress = Math.min(sim.progress, sim.recipe.progress - 1);
        }
        super.apply(sim);
    };

    override durabilityCost(): number {
        return 10;
    }

    progressAdded(sim: Simulation, buffs: number): number {
        return sim.calcProgress(this.getPotency(sim) * buffs / 100);
    };

    getPotency(sim: Simulation): number {
        return 100;
    };
}