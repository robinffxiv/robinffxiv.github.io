import {Simulation} from "../../simulation";
import {Buff} from "../../buffs";
import {Action} from "../action";

export class PatientTouch extends Action {
    override isUsable(sim: Simulation): boolean {
        return sim.buffs[Buff.INNER_QUIET] > 0 && super.isUsable(sim);
    };

    override apply(sim: Simulation) {
        let buffs = 100;
        if (sim.buffs[Buff.GREAT_STRIDES] > 0) {
            buffs += 100;
        }
        if (sim.buffs[Buff.INNOVATION] > 0) {
            buffs += 50;
        }
        if (this.succeeded(sim)) {
            sim.buffs[Buff.GREAT_STRIDES] = 0;
            sim.quality += this.qualityAdded(sim, buffs);
            sim.quality = Math.min(sim.quality, sim.recipe.quality);
            if (sim.buffs[Buff.INNER_QUIET] > 0) {
                sim.buffs[Buff.INNER_QUIET] *= 2;
            }
        } else {
            sim.buffs[Buff.INNER_QUIET] = Math.ceil(sim.buffs[Buff.INNER_QUIET] / 2);
        }
        super.apply(sim);
    };

    qualityAdded(sim: Simulation, buffs: number): number {
        return sim.calcQuality(this.getPotency(sim) * buffs / 100);
    };

    getPotency(sim: Simulation): number {
        return 100;
    };

    override cpCost(sim: Simulation): number {
        return 6;
    };

    override successRate(sim: Simulation): number {
        return 0.5;
    }

    override canFail(): boolean {
        return true;
    }

    override getName(): string {
        return "Patient Touch";
    }
}