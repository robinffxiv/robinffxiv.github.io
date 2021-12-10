import {Simulation} from "../simulation";
import {Buff} from "../buffs";
import {Action} from "./action";

export abstract class ProgressAction extends Action {
    override apply(sim: Simulation): void {
        let buffs = 1;
        if (sim.buffs[Buff.MUSCLE_MEMORY] > 0) {
            buffs += 1;
        }
        if (sim.buffs[Buff.VENERATION] > 0) {
            buffs += .5;
        }
        sim.removeBuff(Buff.MUSCLE_MEMORY);
        sim.progress += this.progressAdded(sim, buffs);
        super.apply(sim);
    };

    override durabilityCost(): number {
        return 10;
    }

    progressAdded(sim: Simulation, buffs: number): number {
        return Math.floor(sim.baseProgress() * this.getPotency(sim) / 100 * buffs);
    };

    getPotency(sim: Simulation): number {
        return 100;
    };
}